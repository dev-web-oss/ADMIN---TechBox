// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjfIJ0FuH-VWRdj0rHFapnEKkr6bIUlvY",
  authDomain: "tech-box-cb857.firebaseapp.com",
  projectId: "tech-box-cb857",
  storageBucket: "tech-box-cb857.firebasestorage.app",
  messagingSenderId: "792563612882",
  appId: "1:792563612882:web:8466799e268140dfcb010b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, db, auth, provider };