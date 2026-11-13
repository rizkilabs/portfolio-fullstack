import { prisma } from "../src/lib/prisma.js";

const projects = [
  {
    title: "Todo List App",
    slug: "todo-list-app",
    description:
      "Aplikasi todo dengan fitur tambah, edit, hapus, dan tandai selesai.",
    thumbnail: "https://placehold.co/600x400?text=Todo+List",
    techStack: ["JavaScript", "React", "LocalStorage"],
    githubUrl: "https://github.com/USERNAME/todo-list",
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    title: "Admin Dashboard",
    slug: "admin-dashboard",
    description:
      "Dashboard admin dengan sidebar, statistik, dan tabel pengguna.",
    thumbnail: "https://placehold.co/600x400?text=Admin+Dashboard",
    techStack: ["React", "Tailwind CSS"],
    githubUrl: "https://github.com/USERNAME/admin-dashboard",
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    title: "Product Catalog",
    slug: "product-catalog",
    description:
      "Katalog produk dengan pencarian, filter kategori, sort, dan pagination.",
    thumbnail: "https://placehold.co/600x400?text=Product+Catalog",
    techStack: ["React", "JavaScript"],
    githubUrl: "https://github.com/USERNAME/product-catalog",
    liveUrl: null,
    featured: false,
  },
];

async function main() {
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("Seed selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
