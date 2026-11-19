import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./lib/prisma.js";
import projectRoutes from "./routes/projects.js";
import type { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import uploadRoutes from "./routes/uploads.js";

const app = express();
app.set("trust proxy", 1);
const PORT = Number(process.env.PORT) || 5000;

app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.use("/api/uploads", uploadRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route tidak ditemukan" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError) {
    return res
      .status(400)
      .json({ success: false, message: "JSON tidak valid" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route tidak ditemukan" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError) {
    return res
      .status(400)
      .json({ success: false, message: "JSON tidak valid" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
