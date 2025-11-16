import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsn3iH_Pd7gZMjLRxesAQpWiz8yB1WCqk",
  authDomain: "privatecameracapture.firebaseapp.com",
  projectId: "privatecameracapture",
  storageBucket: "privatecameracapture.appspot.com",
  messagingSenderId: "329207253992",
  appId: "1:329207253992:web:6bb6b6bb54b7d8888252ed",
  measurementId: "G-VF6F22ESHP"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
