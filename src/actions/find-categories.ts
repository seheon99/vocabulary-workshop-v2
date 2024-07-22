"use server";

import { prisma } from "@/utilities";

export async function findCategories() {
  return await prisma.category.findMany();
}
