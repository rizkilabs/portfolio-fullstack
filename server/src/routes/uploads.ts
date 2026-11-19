import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { supabase, BUCKET } from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: 1 },
});

// Cek isi file (magic bytes), bukan hanya ekstensi atau header dari client
function detectType(buf: Buffer): { mime: string; ext: string } | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (
    buf.length > 8 &&
    buf
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { mime: "image/png", ext: "png" };
  }
  if (
    buf.length > 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}

const router = Router();

// POST /api/uploads (admin): multipart/form-data, field "file"
router.post("/", requireAuth, (req, res) => {
  upload.single("file")(req, res, async (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Ukuran gambar maksimal 2 MB"
          : "Upload gagal";
      return res.status(400).json({ success: false, message });
    }
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File gambar wajib diunggah" });
    }

    const type = detectType(req.file.buffer);
    if (!type) {
      return res
        .status(400)
        .json({ success: false, message: "Format harus JPG, PNG, atau WebP" });
    }

    const path = `projects/${randomUUID()}.${type.ext}`;

    try {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, req.file.buffer, {
          contentType: type.mime,
          cacheControl: "31536000",
          upsert: false,
        });
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      res.status(201).json({ success: true, data: { url: data.publicUrl } });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ success: false, message: "Gagal mengunggah gambar" });
    }
  });
});

export default router;
