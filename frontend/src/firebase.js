import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_wDHvEJc1z5FNepW9TxSwr6qHpLcXAVY", 
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

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
    return { user: result.user, error: "" };
  } catch (error) {
    return { user: null, error: mapAuthError(error), code: error?.code || "" };
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