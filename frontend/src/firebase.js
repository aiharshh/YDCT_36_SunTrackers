// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
  // ... KEEP YOUR EXISTING CONFIG HERE ...
  apiKey: "AIzaSyC_wDHvEJc1z5FNepW9TxSwr6qHpLcXAVY", 
  // etc...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Sign Up Function
export const registerUser = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    alert(error.message);
    return null;
  }
};

// Login Function
export const loginUser = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    alert(error.message);
    return null;
  }
};