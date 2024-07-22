"use server";

import { prisma } from "@/utilities";

export async function createCategory({
  creatorId,
  name,
}: {
  creatorId: string;
  name: string;
}) {
  return await prisma.category.create({
    data: { name, User: { connect: { id: creatorId } } },
  });
}
