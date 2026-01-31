import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Use getDatabase
import { ref, set } from "firebase/database"; // Import these


const firebaseConfig = {
  apiKey: "AIzaSyC_wDHvEJc1z5FNepW9TxSwr6qHpLcXAVY",
  authDomain: "suntrackers-9171b.firebaseapp.com",
  databaseURL: "https://suntrackers-9171b-default-rtdb.firebaseio.com/", // Required for RTDB
  projectId: "suntrackers-9171b",
  storageBucket: "suntrackers-9171b.firebasestorage.app",
  messagingSenderId: "752736161128",
  appId: "1:752736161128:web:5078cbc2d928a9cc705add"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// FIX: Export Realtime Database instead of Firestore
export const db = getDatabase(app);

// --- Authentication Helpers ---
const mapAuthError = (err) => {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/invalid-email":
      return "Email format is invalid.";
    case "auth/email-already-in-use":
      return "Email already in use. Please use a different email.";
    case "auth/weak-password":
      return "Password too weak. Please choose a stronger password.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later.";
    default:
      return err?.message || "Authentication failed.";
  }
};
export const registerUser = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // We use set() to create the user node with the initial 15M grant
    await set(ref(db, `users/${user.uid}`), {
      email: user.email,
      walletBalance: 15000000, // 15 Millioncredits
      createdAt: new Date().toISOString()
    });

    return { user: user, error: "" };
  } catch (error) {
    // Check if the email already exists or if password is too weak
    console.error("Signup Error:", error.code); 
    return { user: null, error: mapAuthError(error) };
  }
};

export const loginUser = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: "" };
  } catch (error) {
    return { user: null, error: mapAuthError(error), code: error?.code || "" };
  }
};