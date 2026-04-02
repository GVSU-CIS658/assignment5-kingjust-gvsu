import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjxLSg_gzVwATj_55a5JDjUE0adVtphyE",
  authDomain: "beverageshop-2819b.firebaseapp.com",
  projectId: "beverageshop-2819b",
  storageBucket: "beverageshop-2819b.firebasestorage.app",
  messagingSenderId: "567176661770",
  appId: "1:567176661770:web:e188f56e378934bd3f08f3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
