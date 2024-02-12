// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";


import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


import "firebase/auth"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRi5kZr-NLlKfqlNdpb6cxlW7pKZqFUq0",
  authDomain: "it-2-1237b.firebaseapp.com",
  databaseURL: "https://it-2-1237b-default-rtdb.firebaseio.com",
  projectId: "it-2-1237b",
  storageBucket: "it-2-1237b.appspot.com",
  messagingSenderId: "475860882639",
  appId: "1:475860882639:web:98e28e4f9c791fe75cd3ba"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };
