// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxy-s7OngT51FFkv0NiRx5Ah478vTsaSU",
  authDomain: "react-firebase-aefe2.firebaseapp.com",
  projectId: "react-firebase-aefe2",
  storageBucket: "react-firebase-aefe2.appspot.com",
  messagingSenderId: "638751830654",
  appId: "1:638751830654:web:34a80a9a8f7e9c0ea89e2f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default db
