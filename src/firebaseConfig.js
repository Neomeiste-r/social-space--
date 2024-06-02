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
  apiKey: "AIzaSyA3IZTXzKBuMLD9Rar4RPihl99gHfk6HBg",
  authDomain: "final-media2.firebaseapp.com",
  databaseURL:
    "https://final-media2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "final-media2",
  storageBucket: "final-media2.appspot.com",
  messagingSenderId: "101454148297",
  appId: "1:101454148297:web:9fbb9c8c7258b1ee7d9318",
  measurementId: "G-VK0Z0LX6WX",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);
const database = getDatabase(firebase);
const auth = getAuth(firebase);
setPersistence(auth, browserSessionPersistence);

export { firebase, database, auth, storage };
