import { getAuth } from "firebase/auth";
import useSWR from "swr";

import { app } from "@/firebase";

export function useCurrentUser() {
  return useSWR(CURRENT_USER_KEY, () => getAuth(app).currentUser);
}

export const CURRENT_USER_KEY = "current-user";
