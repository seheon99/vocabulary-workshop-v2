"use server";

import { prisma } from "@/utilities";

export async function createVocabulary({
  creatorId,
  categoryId,
  term,
  definition,
}: {
  creatorId: string;
  categoryId: string;
  term: string;
  definition: string;
}) {
  return await prisma.vocabulary.create({
    data: {
      term,
      definition,

      User: {
        connect: {
          id: creatorId,
        },
      },

      Category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });
}
