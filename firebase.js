// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkyKvURiS7g1U_tebkE1IItERYbrqLGsg",
  authDomain: "pantry-app-35dce.firebaseapp.com",
  projectId: "pantry-app-35dce",
  storageBucket: "pantry-app-35dce.appspot.com",
  messagingSenderId: "890861785396",
  appId: "1:890861785396:web:4d16df777ce371a28e1561"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {
    app, firestore
}