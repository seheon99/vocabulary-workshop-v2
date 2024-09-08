"use client";

import { useState } from "react";

import { Button } from "@/components/base";
import {
  NewCategoryDialog,
  NewVocabularyDialog,
} from "@/components/features/vocabularies";

export function NewVocabularyButton() {
  const [isOpenVocabulary, setIsOpenVocabulary] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);

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
