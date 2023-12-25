// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNiObjzeOHnjUXDRFOmg4421kB3fCTIpE",
  authDomain: "fb-server-1c3ec.firebaseapp.com",
  projectId: "fb-server-1c3ec",
  storageBucket: "fb-server-1c3ec.appspot.com",
  messagingSenderId: "527357242107",
  appId: "1:527357242107:web:934e337b037fe07609de5e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
