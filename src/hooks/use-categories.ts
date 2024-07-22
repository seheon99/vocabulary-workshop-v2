import useSWR from "swr";

import { findCategories } from "@/actions";

export function useCategories() {
  return useSWR(CATEGORIES_KEY, () => findCategories());
}

export const CATEGORIES_KEY = "categories";
