import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCL2CctB5ULQg2tkWKKTX20-Aot0aGsVYw",
  authDomain: "registrocon-97cb2.firebaseapp.com",
  projectId: "registrocon-97cb2",
  storageBucket: "registrocon-97cb2.appspot.com",
  messagingSenderId: "373644979789",
  appId: "1:373644979789:web:5b08ef46eb8852c59fb604"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Ya no necesitas un archivo separado para esto
function initAuth(callback) {
  onAuthStateChanged(auth, user => callback(user));
}

export { db, auth, initAuth };