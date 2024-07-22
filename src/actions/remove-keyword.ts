"use server";

import { prisma } from "@/utilities";

export async function removeKeyword(id: string) {
  return await prisma.keyword.delete({
    where: { id },
  });
}
