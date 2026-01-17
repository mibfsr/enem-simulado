// app/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- COLE AQUI AS CHAVES DO CONSOLE DO FIREBASE ---
// (Aquela parte que tem apiKey, authDomain, projectId...)
const firebaseConfig = {
  apiKey: "AIzaSyBgNzbgVMUufyYADcKiB0A_A2C5usiEfkc",
  authDomain: "enem-prep-banco.firebaseapp.com",
  projectId: "enem-prep-banco",
  storageBucket: "enem-prep-banco.firebasestorage.app",
  messagingSenderId: "46477786959",
  appId: "1:46477786959:web:013a2908c6ba416eb60f3a"
};
// --------------------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };