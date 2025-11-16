// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsnI3H_Pd7gZMjLRxesAQpWi2y81WCqek",
  authDomain: "privatecameracapture.firebaseapp.com",
  projectId: "privatecameracapture",
  storageBucket: "privatecameracapture.firebasestorage.app",
  messagingSenderId: "322907235992",
  appId: "1:322907235992:web:6bfb06bb54b7d8888252ed",
  measurementId: "G-VF0F22ESHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
