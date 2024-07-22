import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";

import { findKeywords, findSubmission, findVocabulary } from "@/actions";
import { findCategory } from "@/actions/find-category";
import {
  Badge,
  Button,
  Definition,
  KeyboardLink,
  Link,
  Strong,
  Text,
} from "@/components/base";
import { EditVocabularyButton } from "@/components/features/vocabularies";

export default async function Submission({
  params: { id },
}: {
  params: { id: string };
}) {
  const submission = await findSubmission(id);
  if (!submission) {
    notFound();
  }

  const vocabulary = await findVocabulary(submission.vocabularyId);
  if (!vocabulary) {
    notFound();
  }

  const category = await findCategory(vocabulary.categoryId);
  const keywords = await findKeywords({ vocabularyId: vocabulary.id });
  const keywordTexts = keywords.map((keyword) => keyword.text);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-20">
      <main className="flex flex-col gap-8">
        <div>
          <Badge>{category?.name}</Badge>
          <h1>
            <Strong className="text-3xl">{vocabulary.term}</Strong>
            <EditVocabularyButton vocabulary={vocabulary} />
          </h1>
        </div>
        <div>
          <Strong>Your Answer</Strong>
          <Definition
            value={submission.answer}
            keywords={keywordTexts}
            color="blue"
          />
        </div>
        <div>
          <Strong>Definition</Strong>
          <Definition
            value={vocabulary.definition}
            keywords={keywords.map((k) => k.text)}
          />
        </div>
        <div className="flex">
          <div className="flex-1">
            <Strong>Included Keywords</Strong>
            <div className="mt-2 flex flex-wrap gap-2">
              {keywords
                .filter((keyword) => submission.answer.includes(keyword.text))
                .map((keyword) => (
                  <Badge key={keyword.id} color="blue">
                    {keyword.text}
                  </Badge>
                ))}
            </div>
          </div>
          <div className="flex-1">
            <Strong>Missing Keywords</Strong>
            <div className="mt-2 flex flex-wrap gap-2">
              {keywords
                .filter((keyword) => !submission.answer.includes(keyword.text))
                .map((keyword) => (
                  <Badge key={keyword.id} color="red">
                    {keyword.text}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </main>
      <div className="flex justify-between">
        <div className="flex flex-1 justify-start">
          <Link href={`/`}>
            <Button plain>
              <ChevronLeftIcon /> Back to home
            </Button>
          </Link>
        </div>
        <div className="flex flex-1 justify-center">
          <Link href={`/quiz/${vocabulary.id}`}>
            <Button plain>
              <ArrowPathIcon /> Retry
            </Button>
          </Link>
        </div>
        <div className="flex flex-1 justify-end">
          <Link href="/quiz">
            <Button plain>
              Next <ChevronRightIcon />
            </Button>
          </Link>
        </div>
      </div>
      <KeyboardLink
        className="animate-pulse text-center"
        keyName="Enter"
        href="/quiz"
      >
        <Text>
          Press <Strong>Enter</Strong> to continue
        </Text>
      </KeyboardLink>
    </div>
  );
}
