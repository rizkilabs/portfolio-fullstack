import { Router } from "express";
import { BUCKET, supabase } from "../lib/supabase.js";

const router = Router();

router.post("/", async (_req, res) => {
  res.json({
    success: true,
    message: "Upload route berhasil",
    bucket: BUCKET,
  });
});

export default router;
