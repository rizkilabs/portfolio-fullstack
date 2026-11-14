import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../lib/jwt.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });
  }

  try {
    const adminId = verifyToken(header.slice(7));
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true },
    });
    if (!admin) throw new Error("Admin tidak ada");

    res.locals.adminId = admin.id;
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Token tidak valid atau kedaluwarsa" });
  }
};
