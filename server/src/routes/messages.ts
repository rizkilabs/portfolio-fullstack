import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import {
  createMessageSchema,
  updateMessageSchema,
} from "../schemas/message.js";
import { parseId } from "../utils/parseId.js";

const router = Router();

const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak pesan terkirim, coba lagi nanti",
  },
});

// POST /api/messages (publik)
router.post(
  "/",
  messageLimiter,
  validate(createMessageSchema),
  async (req, res) => {
    const { name, email, subject, message, website } = req.body;

    // honeypot terisi: kemungkinan bot, pura-pura sukses tanpa menyimpan
    if (website) {
      return res.status(201).json({ success: true, message: "Pesan terkirim" });
    }

    try {
      await prisma.message.create({ data: { name, email, subject, message } });
      res
        .status(201)
        .json({ success: true, message: "Pesan berhasil dikirim" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

// GET /api/messages?page=1&limit=10&isRead=false (admin)
router.get("/", requireAuth, async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

  const where: Prisma.MessageWhereInput = {};
  if (req.query.isRead === "true") where.isRead = true;
  if (req.query.isRead === "false") where.isRead = false;

  try {
    const [total, messages] = await Promise.all([
      prisma.message.count({ where }),
      prisma.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({
      success: true,
      data: messages,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/messages/:id (admin)
router.get("/:id", requireAuth, async (req, res) => {
  const paramId = req.params.id;

  if (typeof paramId !== "string") {
    return res.status(400).json({
      success: false,
      message: "ID tidak valid",
    });
  }

  const id = parseId(paramId);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID tidak valid",
    });
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    res.json({ success: true, data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// PATCH /api/messages/:id (admin): tandai dibaca / belum dibaca
router.patch(
  "/:id",
  requireAuth,
  validate(updateMessageSchema),
  async (req, res) => {
    const paramId = req.params.id;

    if (typeof paramId !== "string") {
      return res.status(400).json({
        success: false,
        message: "ID tidak valid",
      });
    }

    const id = parseId(paramId);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID tidak valid",
      });
    }

    try {
      const message = await prisma.message.update({
        where: { id },
        data: { isRead: req.body.isRead },
      });

      res.json({ success: true, data: message });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return res.status(404).json({
          success: false,
          message: "Pesan tidak ditemukan",
        });
      }

      console.error(err);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
);

// DELETE /api/messages/:id (admin)
router.delete("/:id", requireAuth, async (req, res) => {
  const paramId = req.params.id;

  if (typeof paramId !== "string") {
    return res.status(400).json({
      success: false,
      message: "ID tidak valid",
    });
  }

  const id = parseId(paramId);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID tidak valid",
    });
  }

  try {
    await prisma.message.delete({ where: { id } });

    res.json({
      success: true,
      message: "Pesan berhasil dihapus",
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
