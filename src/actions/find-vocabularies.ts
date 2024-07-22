"use server";

import { prisma } from "@/utilities";

export async function findVocabularies() {
  return await prisma.vocabulary.findMany();
}
