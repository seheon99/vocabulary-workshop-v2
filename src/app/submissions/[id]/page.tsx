import { ArrowTurnDownLeftIcon } from "@heroicons/react/16/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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

  const order =
    query.order === "sequential"
      ? "sequential"
      : query.order === "random"
        ? "random"
        : undefined;
  const start = parseNumber(query.start);
  const end = parseNumber(query.end);
  const cursor = parseNumber(query.cursor);

  const continueParams = new URLSearchParams();
  if (order) {
    continueParams.set("order", order);
  }
  if (typeof start === "number") {
    continueParams.set("start", String(start));
  }
  if (typeof end === "number") {
    continueParams.set("end", String(end));
  }

  if (order === "sequential" && typeof start === "number") {
    const safeStart = Math.max(1, start);
    const safeEnd = typeof end === "number" ? Math.max(end, safeStart) : safeStart;
    const currentCursor =
      typeof cursor === "number" && cursor >= safeStart && cursor <= safeEnd
        ? cursor
        : safeStart;
    const nextCursor = currentCursor + 1 > safeEnd ? safeStart : currentCursor + 1;
    continueParams.set("cursor", String(nextCursor));
  } else if (order === "sequential" && typeof end === "number") {
    const safeEnd = Math.max(1, end);
    const safeStart = typeof start === "number" ? Math.max(1, start) : 1;
    const currentCursor =
      typeof cursor === "number" && cursor >= safeStart && cursor <= safeEnd
        ? cursor
        : safeStart;
    const nextCursor = currentCursor + 1 > safeEnd ? safeStart : currentCursor + 1;
    continueParams.set("cursor", String(nextCursor));
  }

  const continueQuery = continueParams.toString();
  const continueHref = continueQuery ? `/quiz?${continueQuery}` : "/quiz";

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
        <div className="flex flex-1 items-center justify-start">
          <Link href={`/`}>
            <Button plain>
              <ChevronLeftIcon /> Back to home
            </Button>
          </Link>
        </div>
        <div className="flex gap-4">
          <KeyboardLink
            className="flex items-center justify-center"
            keyName="r"
            href={`/quiz/${vocabulary.id}`}
            context="screen"
          >
            <Text>
              <Button className="lg:mx-2" color="light">
                R
              </Button>
              to retry
            </Text>
          </KeyboardLink>
          <KeyboardLink
            className="flex items-center justify-center"
            keyName="Enter"
            href={continueHref}
            context="screen"
          >
            <Text>
              <Button className="lg:mx-2" color="light">
                <ArrowTurnDownLeftIcon /> Enter
              </Button>
              to continue
            </Text>
          </KeyboardLink>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <Link href={continueHref}>
            <Button plain>
              Next <ChevronRightIcon />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
