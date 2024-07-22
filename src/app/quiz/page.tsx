import { redirect } from "next/navigation";

import { findRandomVocabulary } from "@/actions";

export default async function QuizPage() {
  const vocabulary = await findRandomVocabulary();
  if (!vocabulary) {
    return redirect("/vocabularies");
  }
  return redirect(`/quiz/${vocabulary.id}`);
}
