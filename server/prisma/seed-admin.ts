import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log(
      "ADMIN_EMAIL / ADMIN_PASSWORD tidak diset, seed admin dilewati",
    );
    return;
  }
  if (ADMIN_PASSWORD.length < 12) {
    throw new Error("ADMIN_PASSWORD minimal 12 karakter");
  }

  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME ?? "Admin", password },
    create: { email: ADMIN_EMAIL, name: ADMIN_NAME ?? "Admin", password },
  });
  console.log("Admin siap");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
