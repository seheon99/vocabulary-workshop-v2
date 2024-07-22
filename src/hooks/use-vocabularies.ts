import useSWR from "swr";

import { findVocabularies } from "@/actions";

export function useVocabularies() {
  return useSWR(VOCABULARIES_KEY, () => findVocabularies());
}

export const VOCABULARIES_KEY = "vocabularies";
