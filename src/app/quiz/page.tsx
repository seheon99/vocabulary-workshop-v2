"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

import { findRandomVocabulary } from "@/actions";
import { Text } from "@/components/base";

export default function QuizPage() {
  const { data: vocabulary } = useSWR("random-vocabulary", () => findRandomVocabulary());

  const router = useRouter();

  useEffect(() => {
    if (vocabulary === null) {
      router.replace("/vocabularies");
    }
    if (vocabulary) {
      router.replace(`/quiz/${vocabulary.id}`);
    }
  }, [vocabulary]);

  return <Text>Loading</Text>;
}
