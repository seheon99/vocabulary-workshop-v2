"use server";

import { prisma } from "@/utilities";

export async function findKeywords({ vocabularyId }: { vocabularyId: string }) {
  return await prisma.keyword.findMany({
    where: {
      vocabularyId,
    },
  });
}
