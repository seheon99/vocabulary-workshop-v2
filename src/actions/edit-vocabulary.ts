"use server";

import { prisma } from "@/utilities";

export async function editVocabulary({
  id,
  categoryId,
  term,
  definition,
}: {
  id: string;
  categoryId: string;
  term: string;
  definition: string;
}) {
  return await prisma.vocabulary.update({
    where: {
      id,
    },
    data: {
      term,
      definition,

      Category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });
}
