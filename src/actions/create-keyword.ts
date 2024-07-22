"use server";

import { prisma } from "@/utilities";

export async function createKeyword({
  vocabularyId,
  text,
}: {
  vocabularyId: string;
  text: string;
}) {
  return await prisma.keyword.create({
    data: { text, Vocabulary: { connect: { id: vocabularyId } } },
  });
}
