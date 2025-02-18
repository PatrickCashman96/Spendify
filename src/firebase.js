// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Changed API Key to Google Cloud API key, put restrictions on GCP to only allow pings on the website
const firebaseConfig = {
  apiKey: "AIzaSyCcygIcHc4DIzWJJSpQ-vh43Jn4qq8kNJA",
  authDomain: "spenderr-348a8.firebaseapp.com",
  projectId: "spenderr-348a8",
  storageBucket: "spenderr-348a8.firebasestorage.app",
  messagingSenderId: "216154268357",
  appId: "1:216154268357:web:1a927a97f52b2fd8ec46ac",
  measurementId: "G-GSB2VNQVHE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }