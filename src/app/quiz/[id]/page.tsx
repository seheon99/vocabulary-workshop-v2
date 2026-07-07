import { redirect } from "next/navigation";

import { findVocabulary } from "@/actions/find-vocabulary";
import { Heading } from "@/components/base";
import { QuizForm } from "@/components/features/quiz";

import type { QuizOptions } from "@/components/features/quiz/quiz-form";

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    order?: string;
    start?: string;
    end?: string;
    cursor?: string;
  }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const parseNumber = (value?: string) => {
    if (!value) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const options: QuizOptions = {
    order:
      query.order === "sequential"
        ? "sequential"
        : query.order === "random"
          ? "random"
          : undefined,
    start: parseNumber(query.start),
    end: parseNumber(query.end),
    cursor: parseNumber(query.cursor),
  };

  const vocabulary = await findVocabulary(id);
  if (!vocabulary) {
    return redirect("/vocabularies");
  }
  return (
    <main className="flex flex-col">
      <Heading className="!text-3xl">{vocabulary.term}</Heading>
      <QuizForm vocabularyId={id} quizOptions={options} />
    </main>
  );
}
