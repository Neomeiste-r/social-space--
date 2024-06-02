// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import "firebase/storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrN59eJWd1SFJ2khU33wCVsDRhoxlNo1M",
  authDomain: "fyp11-425219.firebaseapp.com",
  projectId: "fyp11-425219",
  storageBucket: "fyp11-425219.appspot.com",
  messagingSenderId: "852052393749",
  appId: "1:852052393749:web:21224797cb2f5ae767331c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);
const database = getDatabase(firebase);
const auth = getAuth(firebase);
setPersistence(auth, browserSessionPersistence);

export { firebase, database, auth, storage };
