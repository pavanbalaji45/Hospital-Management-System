import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAruhlzBbZbxD7y4wF0OyhdViFpjb1k4E4",
  authDomain: "hos-man-2cd62.firebaseapp.com",
  projectId: "hos-man-2cd62",
  storageBucket: "hos-man-2cd62.firebasestorage.app",
  messagingSenderId: "31892595025",
  appId: "1:31892595025:web:b417f4b38adff8f74b7370",
  measurementId: "G-5C39SPWN4F",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, query, where, getDocs, addDoc };

/* 
  38953802958c42332077caaee54a0ec6-72e4a3d5-556d94a3


  72e4a3d5-556d94a3 */
