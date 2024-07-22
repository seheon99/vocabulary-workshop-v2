"use server";

import { prisma } from "@/utilities";

export async function createUser({ id, email }: { id: string; email: string }) {
  return await prisma.user.create({
    data: {
      id,
      email,
    },
  });
}
