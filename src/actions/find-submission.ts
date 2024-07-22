"use server";

import { prisma } from "@/utilities";

export async function findSubmission(id: string) {
  return prisma.submission.findUnique({
    where: {
      id,
    },
  });
}
