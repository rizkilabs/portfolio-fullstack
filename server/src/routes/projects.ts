import { Router } from "express";
import type { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { validate } from "../middleware/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/project.js";
import { slugify } from "../utils/slugify.js";

const router = Router();

function handleError(err: unknown, res: Response) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ success: false, message: "Slug sudah dipakai project lain" });
    }
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Project tidak ditemukan" });
    }
  }
  console.error(err);
  return res.status(500).json({ success: false, message: "Server error" });
}

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/projects
router.get("/", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
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
    handleError(err, res);
  }
});

// POST /api/projects
router.post("/", validate(createProjectSchema), async (req, res) => {
  try {
    const data = req.body;
    const project = await prisma.project.create({
      data: { ...data, slug: data.slug ?? slugify(data.title) },
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    handleError(err, res);
  }
});

// PUT /api/projects/:id
router.put("/:id", validate(updateProjectSchema), async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "ID tidak valid" });
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: req.body,
    });
    res.json({ success: true, data: project });
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "ID tidak valid" });
  }

  try {
    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: "Project berhasil dihapus" });
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
