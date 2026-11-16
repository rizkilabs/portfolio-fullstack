import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
          Memuat...
        </div>
      }
    >
      <DashboardClient>{children}</DashboardClient>
    </Suspense>
  );
}
