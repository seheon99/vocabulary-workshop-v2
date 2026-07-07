"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

import { findVocabularies } from "@/actions";
import {
  Button,
  Field,
  Fieldset,
  Heading,
  Label,
  Select,
  Text,
} from "@/components/base";
import { useCurrentUser } from "@/hooks";

type OrderOption = "random" | "sequential";

export default function QuizPage() {
  const { data: vocabularies } = useSWR("vocabularies", () =>
    findVocabularies(),
  );

  const sortedVocabularies = useMemo(
    () =>
      vocabularies
        ? [...vocabularies].sort((a, b) =>
            a.term.localeCompare(b.term, undefined, { sensitivity: "base" }),
          )
        : [],
    [vocabularies],
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<OrderOption>("random");
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(1);

  const { data: user, isLoading: isLoadingUser } = useCurrentUser();

  useEffect(() => {
    if (!isLoadingUser && !user) {
      toast.error("You have to login before quiz");
      router.replace("/");
    }
  }, [isLoadingUser, user, router]);

  useEffect(() => {
    if (sortedVocabularies.length > 0) {
      setEndIndex(sortedVocabularies.length);
    }
  }, [sortedVocabularies.length]);

  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current || sortedVocabularies.length === 0) {
      return;
    }

    const total = sortedVocabularies.length;

    const parseIndex = (value: string | null) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const orderParam = searchParams.get("order");
    const initialOrder: OrderOption =
      orderParam === "sequential" ? "sequential" : "random";

    const startParam = parseIndex(searchParams.get("start")) ?? 1;
    const endParam = parseIndex(searchParams.get("end")) ?? total;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const safeStart = clamp(startParam, 1, total);
    const safeEnd = clamp(endParam, safeStart, total);

    setOrder(initialOrder);
    setStartIndex(safeStart);
    setEndIndex(safeEnd);

    hasInitialized.current = true;
  }, [searchParams, sortedVocabularies]);

  const hasAutoStarted = useRef(false);

  const startQuiz = useCallback(
    (
      options: {
        order: OrderOption;
        start?: number;
        end?: number;
        cursor?: number;
        showCompletionToast?: boolean;
      },
    ) => {
      if (!user || sortedVocabularies.length === 0) {
        return;
      }

      const total = sortedVocabularies.length;
      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

      const startValue = clamp(options.start ?? 1, 1, total);
      const endValue = clamp(options.end ?? total, startValue, total);

      if (startValue > endValue) {
        toast.error("Invalid range selected for the quiz");
        return;
      }

      let targetIndex = startValue - 1;
      const params = new URLSearchParams({
        order: options.order,
        start: String(startValue),
        end: String(endValue),
      });

      if (options.order === "sequential") {
        let cursorValue = options.cursor ?? startValue;
        if (cursorValue < startValue) {
          cursorValue = startValue;
        }
        if (cursorValue > endValue) {
          cursorValue = startValue;
          if (options.showCompletionToast) {
            toast.info("You've completed the selected range. Starting over.");
          }
        }
        targetIndex = cursorValue - 1;
        params.set("cursor", String(cursorValue));
      } else {
        targetIndex =
          startValue - 1 +
          Math.floor(Math.random() * (endValue - startValue + 1));
      }

      const vocabulary = sortedVocabularies[targetIndex];
      if (!vocabulary) {
        toast.error("Unable to find a vocabulary for the selected options");
        return;
      }

      const query = params.toString();
      router.push(`/quiz/${vocabulary.id}${query ? `?${query}` : ""}`);
    },
    [router, sortedVocabularies, user],
  );

  useEffect(() => {
    if (
      hasAutoStarted.current ||
      sortedVocabularies.length === 0 ||
      !user
    ) {
      return;
    }

    const orderParam = searchParams.get("order");
    if (!orderParam) {
      return;
    }

    const parseIndex = (value: string | null) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const orderValue: OrderOption =
      orderParam === "sequential" ? "sequential" : "random";
    const startValue = parseIndex(searchParams.get("start"));
    const endValue = parseIndex(searchParams.get("end"));
    const cursorValue = parseIndex(searchParams.get("cursor"));

    hasAutoStarted.current = true;
    startQuiz({
      order: orderValue,
      start: startValue,
      end: endValue,
      cursor: cursorValue,
      showCompletionToast: true,
    });
  }, [searchParams, sortedVocabularies.length, startQuiz, user]);

  const handleStartChange = (value: number) => {
    setStartIndex(value);
    if (value > endIndex) {
      setEndIndex(value);
    }
  };

  const handleEndChange = (value: number) => {
    setEndIndex(value);
    if (value < startIndex) {
      setStartIndex(value);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Heading>Select Quiz Options</Heading>
        <Text>
          Choose the range of vocabularies you would like to practise and how
          they should be ordered for the quiz.
        </Text>
      </div>

      <Fieldset className="space-y-6">
        <Field>
          <Label htmlFor="quiz-order">Question order</Label>
          <Select
            id="quiz-order"
            value={order}
            onChange={(event) =>
              setOrder(event.target.value as OrderOption)
            }
          >
            <option value="random">Random</option>
            <option value="sequential">Sequential</option>
          </Select>
        </Field>

        <Field>
          <Label>Question range</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              value={startIndex}
              onChange={(event) =>
                handleStartChange(Number(event.target.value))
              }
            >
              {sortedVocabularies.map((vocabulary, index) => (
                <option key={vocabulary.id} value={index + 1}>
                  {index + 1}. {vocabulary.term}
                </option>
              ))}
            </Select>
            <Select
              value={endIndex}
              onChange={(event) =>
                handleEndChange(Number(event.target.value))
              }
            >
              {sortedVocabularies.map((vocabulary, index) => (
                <option key={vocabulary.id} value={index + 1}>
                  {index + 1}. {vocabulary.term}
                </option>
              ))}
            </Select>
          </div>
          <Text className="text-sm text-zinc-500">
            Select the first and last vocabulary that should appear in the
            quiz.
          </Text>
        </Field>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() =>
              startQuiz({
                order,
                start: startIndex,
                end: endIndex,
              })
            }
            disabled={sortedVocabularies.length === 0 || !user}
          >
            Start quiz
          </Button>
        </div>
      </Fieldset>

      {sortedVocabularies.length === 0 && (
        <Text className="text-sm text-zinc-500">
          There are no vocabularies available. Add some words before starting a
          quiz.
        </Text>
      )}
    </main>
  );
}
