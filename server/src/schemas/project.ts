import { z } from "zod";

export const PROJECT_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "FULLSTACK",
] as const;

export const createProjectSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(100),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda -",
    )
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000),
  thumbnail: z.url("Thumbnail harus berupa URL").nullable().optional(),
  techStack: z
    .array(z.string().trim().min(1))
    .min(1, "Minimal 1 teknologi")
    .max(15),
  githubUrl: z.url("Link GitHub harus berupa URL").nullable().optional(),
  liveUrl: z.url("Link Live Demo harus berupa URL").nullable().optional(),
  featured: z.boolean().optional(),
  category: z.enum(PROJECT_CATEGORIES).optional(),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu field harus diisi",
  });

export const listProjectsQuerySchema = z.object({
  category: z.enum(PROJECT_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
