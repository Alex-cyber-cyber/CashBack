
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAe11mG5StPJbMZyy26koDsSSteoft_e_0",
  authDomain: "cashback-f20ee.firebaseapp.com",
  projectId: "cashback-f20ee",
  storageBucket: "cashback-f20ee.firebasestorage.app",
  messagingSenderId: "725122348180",
  appId: "1:725122348180:web:f90f0a4dd7cfa5ccb1b081"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence); 

const db = getFirestore(app);
const storage = getStorage(app);

export async function ensureTestAuth() {
  if (!auth.currentUser) await signInAnonymously(auth);
}



export { app, auth, db, storage, firebaseConfig };