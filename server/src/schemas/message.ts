import { z } from "zod";

export const createMessageSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  email: z.email("Email tidak valid").max(150),
  subject: z.string().trim().min(3, "Subject minimal 3 karakter").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal 10 karakter")
    .max(2000, "Pesan maksimal 2000 karakter"),
  // honeypot: field tersembunyi di form, manusia tidak akan mengisinya
  website: z.string().optional(),
});

export const updateMessageSchema = z.object({
  isRead: z.boolean(),
});
