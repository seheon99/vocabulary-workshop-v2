import { redirect } from "next/navigation";

import { findVocabulary } from "@/actions/find-vocabulary";
import { Heading } from "@/components/base";
import { QuizForm } from "@/components/features/quiz";

export default async function QuizPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const vocabulary = await findVocabulary(id);
  if (!vocabulary) {
    return redirect("/vocabularies");
  }

  return (
    <main className="flex flex-col">
      <Heading className="!text-3xl">{vocabulary.term}</Heading>
      <QuizForm vocabularyId={id} />
    </main>
  );
}
