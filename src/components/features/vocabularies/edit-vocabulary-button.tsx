"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Vocabulary } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/base";

import { EditVocabularyDialog } from "./edit-vocabulary-dialog";

export function EditVocabularyButton({
  vocabulary,
}: {
  vocabulary: Vocabulary;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button plain onClick={() => setIsOpen(true)}>
        <PencilSquareIcon />
      </Button>
      <EditVocabularyDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        vocabulary={vocabulary}
      />
    </>
  );
}
