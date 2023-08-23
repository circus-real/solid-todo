//! --------------- Firebase ---------------
import { initializeApp } from "firebase/app";

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
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

//! --------------- Rendering ---------------
/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { FirebaseProvider } from "solid-firebase";
import { getFirestore } from "firebase/firestore";

const root = document.getElementById("root");

render(
  () => (
    <FirebaseProvider app={app}>
      <App />
    </FirebaseProvider>
  ),
  root!
);
