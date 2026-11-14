import { Router } from "express";
import bcrypt from "bcryptjs";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema } from "../schemas/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan login, coba lagi 15 menit lagi",
  },
});

// POST /api/auth/login
router.post("/login", loginLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    const valid = admin
      ? await bcrypt.compare(password, admin.password)
      : false;

    if (!admin || !valid) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    const token = signToken(admin.id);
    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin.id, name: admin.name, email: admin.email },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (_req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: res.locals.adminId },
      select: { id: true, name: true, email: true },
    });
    res.json({ success: true, data: admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
