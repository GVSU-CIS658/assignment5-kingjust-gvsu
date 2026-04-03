import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6iipY6gKsubIC406hpuZkK_Fnh1VXohE",
  authDomain: "beverageshop-11901.firebaseapp.com",
  projectId: "beverageshop-11901",
  storageBucket: "beverageshop-11901.firebasestorage.app",
  messagingSenderId: "560584874575",
  appId: "1:560584874575:web:d2b9e2dc65c71ad96c683a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
export default db;
