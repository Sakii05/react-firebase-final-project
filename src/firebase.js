import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These keys are unique to your "frontend-backend-harold" project
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // This connects your code to the Firestore database