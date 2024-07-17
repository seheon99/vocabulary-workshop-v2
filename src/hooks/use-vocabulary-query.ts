import { collection, getDocs } from "firebase/firestore";
import useSWR from "swr";

import { firestore } from "@/firebase";

import type { Vocabulary } from "@/types/vocabulary";

export function useVocabulariesQuery() {
  return useSWR(
    VOCABULARY_QUERY_KEY,
    async (path) => {
      const querySnapshot = await getDocs(collection(firestore, path));
      return Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            categoryId: data.category._key.path.segments.at(-1),
            name: data.name,
            definition: data.definition,
          } as Vocabulary;
        }),
      );
    },
    { dedupingInterval: 1000 * 60 * 60 },
  );
}

export const VOCABULARY_QUERY_KEY = "vocabularies";
