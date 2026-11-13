import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/projects
router.get("/", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false, message: "ID tidak valid" });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project tidak ditemukan" });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
