"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import type { Message, PaginatedResponse } from "@/types";

type Filter = "all" | "unread";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessagesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResponse<Message> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    const query = new URLSearchParams({ page: String(page), limit: "10" });
    if (filter === "unread") query.set("isRead", "false");

    adminApi<PaginatedResponse<Message>>(`/api/messages?${query}`)
      .then((res) => {
        if (!ignore) {
          setResult(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore)
          setError(err instanceof Error ? err.message : "Gagal memuat pesan");
      });

    return () => {
      ignore = true;
    };
  }, [filter, page, reloadKey]);

  function changeFilter(next: Filter) {
    setFilter(next);
    setPage(1);
    setResult(null);
    setOpenId(null);
  }

  async function setRead(id: number, isRead: boolean) {
    try {
      await adminApi(`/api/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead }),
      });
      setResult((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((m) => (m.id === id ? { ...m, isRead } : m)),
            }
          : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui pesan");
    }
  }

  function toggleOpen(m: Message) {
    const opening = openId !== m.id;
    setOpenId(opening ? m.id : null);
    if (opening && !m.isRead) setRead(m.id, true); // otomatis tandai dibaca saat dibuka
  }

  async function handleDelete(m: Message) {
    if (!window.confirm(`Hapus pesan dari ${m.name}?`)) return;

    try {
      await adminApi(`/api/messages/${m.id}`, { method: "DELETE" });
      setOpenId(null);
      // kalau ini satu-satunya pesan di halaman ini, mundur satu halaman
      if (result && result.data.length === 1 && page > 1) setPage((p) => p - 1);
      else setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus pesan");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>

      <div className="mt-4 flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => changeFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {f === "all" ? "Semua" : "Belum dibaca"}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {!result && !error && (
        <p className="mt-6 text-sm text-gray-500">Memuat...</p>
      )}

      {result && result.data.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">
          {filter === "unread"
            ? "Tidak ada pesan yang belum dibaca."
            : "Belum ada pesan masuk."}
        </p>
      )}

      {result && result.data.length > 0 && (
        <>
          <ul className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-surface">
            {result.data.map((m) => {
              const open = openId === m.id;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => toggleOpen(m)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm ${m.isRead ? "" : "font-semibold"}`}
                      >
                        {!m.isRead && (
                          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-600" />
                        )}
                        {m.subject}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {m.name} · {m.email}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-500">
                      {formatDate(m.createdAt)}
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {m.message}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <a
                          href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                          className="text-indigo-600 hover:underline"
                        >
                          Balas via email
                        </a>
                        <button
                          onClick={() => setRead(m.id, !m.isRead)}
                          className="text-gray-600 hover:underline"
                        >
                          {m.isRead
                            ? "Tandai belum dibaca"
                            : "Tandai sudah dibaca"}
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          className="text-red-600 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-gray-600">
              Halaman {result.meta.page} dari{" "}
              {Math.max(result.meta.totalPages, 1)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= result.meta.totalPages}
              className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </>
      )}
    </div>
  );
}
