import { initializeApp } from "firebase/app";

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
