//! --------------- Firebase ---------------
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDP3X-IkIecxrrMyuj4DOkpe3b9TMWCPDk",
  authDomain: "solid-todo.firebaseapp.com",
  projectId: "solid-todo",
  storageBucket: "solid-todo.appspot.com",
  messagingSenderId: "632773039403",
  appId: "1:632773039403:web:66122fd9c10b6c7361616e",
  measurementId: "G-QXF0PJWY0C",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

//! --------------- Rendering ---------------
/* @refresh reload */
import { render } from "solid-js/web";

import { FirebaseProvider } from "solid-firebase";
import "./index.css";
import App from "./App";

const root = document.getElementById("root");

render(
  () => (
    <FirebaseProvider app={app}>
      <App />
    </FirebaseProvider>
  ),
  root!
);
