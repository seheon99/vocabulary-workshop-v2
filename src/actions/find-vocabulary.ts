"use server";

import { prisma } from "@/utilities";

export async function findVocabulary(id: string) {
  return await prisma.vocabulary.findUnique({
    where: {
      id,
    },
  });
}
