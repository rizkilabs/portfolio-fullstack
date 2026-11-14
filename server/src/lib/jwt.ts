import "dotenv/config";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  throw new Error("JWT_SECRET belum diset atau kurang dari 32 karakter");
}

export const signToken = (adminId: number) =>
  jwt.sign({ sub: String(adminId) }, secret, {
    algorithm: "HS256",
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
  });

export const verifyToken = (token: string) => {
  const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
  if (typeof payload === "string" || !payload.sub) {
    throw new Error("Payload token tidak valid");
  }
  return Number(payload.sub);
};
