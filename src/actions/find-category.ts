"use server";

import { prisma } from "@/utilities";

export async function findCategory(id: string) {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
}
