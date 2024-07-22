"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/base";
import {
  NewCategoryDialog,
  NewVocabularyDialog,
} from "@/components/features/vocabularies";
import { useCurrentUser } from "@/hooks";

export function NewVocabularyButton() {
  const { data: user } = useCurrentUser();

  const [isOpenVocabulary, setIsOpenVocabulary] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);

  const router = useRouter();

  if (user === null) {
    toast.error("You need to be logged");
    router.replace("/");
  }

  return (
    <>
      <Button plain onClick={() => setIsOpenVocabulary(true)}>
        Create a new Vocabulary
      </Button>
      <NewVocabularyDialog
        open={isOpenVocabulary}
        onClose={() => setIsOpenVocabulary(false)}
        showCategoryDialog={() => setIsOpenCategory(true)}
      />
      <NewCategoryDialog
        open={isOpenCategory}
        onClose={() => setIsOpenCategory(false)}
      />
    </>
  );
}
