import { isNil } from "es-toolkit";
import { doc, getDoc } from "firebase/firestore";
import useSWR from "swr";

import { firestore } from "@/firebase";

import type { Category } from "@/types";

export function useCategoryQuery(id?: string | null) {
  return useSWR(
    CATEGORY_QUERY_KEY(id),
    async ([collection, id]) => {
      const docSnap = await getDoc(doc(firestore, collection, id));
      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
      } as Category;
    },
    { dedupingInterval: 1000 * 60 * 60 },
  );
}

const CATEGORY_QUERY_KEY = (id?: string | null) =>
  isNil(id) ? null : ["categories", id];
