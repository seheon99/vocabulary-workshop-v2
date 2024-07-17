import { initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import { mutate } from "swr";

import { CURRENT_USER_KEY } from "./hooks";

const firebaseConfig = {
  apiKey: "AIzaSyA0tuVZ-YPzZBlEB7it0dSeUFUqlwxkScQ",
  authDomain: "vocabulary-workshop.firebaseapp.com",
  projectId: "vocabulary-workshop",
  storageBucket: "vocabulary-workshop.appspot.com",
  messagingSenderId: "228981863509",
  appId: "1:228981863509:web:c87adcf6bf680140e790dc",
  measurementId: "G-PC7XNE4ETJ",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);
onAuthStateChanged(auth, () => mutate(CURRENT_USER_KEY));
