import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7sFrcGfXG4gXPIeM3bxYM1WPjGxcdIV4",
  authDomain: "todo-project-4af7c.firebaseapp.com",
  projectId: "todo-project-4af7c",
  storageBucket: "todo-project-4af7c.firebasestorage.app",
  messagingSenderId: "278045821808",
  appId: "1:278045821808:web:fa3288da63f0a7b58e1db5",
  measurementId: "G-BQ7Z9J3E58",
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const logout = () => signOut(auth);
export { db, collection, addDoc, getDocs, deleteDoc, doc };
