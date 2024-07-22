"use server";

import { Vocabulary } from "@prisma/client";

import { prisma } from "@/utilities";

export async function findRandomVocabulary() {
  const records = await prisma.$queryRaw<
    Vocabulary[]
  >`SELECT * FROM Vocabulary ORDER BY RANDOM() LIMIT 1;`;

  return records.length > 0 ? records[0] : null;
}
