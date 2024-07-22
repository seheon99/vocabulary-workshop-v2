"use server";

import { prisma } from "@/utilities";

export async function createSubmission({
  userId,
  vocabularyId,
  answer,
}: {
  userId: string;
  vocabularyId: string;
  answer: string;
}) {
  return await prisma.submission.create({
    data: {
      answer,
      userId,
      vocabularyId,
    },
  });
}
