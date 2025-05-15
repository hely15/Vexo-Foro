// Importa solo lo necesario de Firebase (versión modular)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "",
    authDomain: "vexo-a9eff.firebaseapp.com",
    projectId: "vexo-a9eff",
    storageBucket: "vexo-a9eff.appspot.com",
    messagingSenderId: "1016481624740",
    appId: "1:1016481624740:web:7ccc7ba8a5dfb51ed12c31",
    measurementId: "G-24G8677F1B"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = firebase.firestore()

// Función para iniciar sesión con Google
function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(result => {
            const user = result.user;
            console.log("Usuario logueado:", user);
        })
        .catch(error => {
            console.error("Error al iniciar sesión:", error);
            alert(error.message);
        });
}

// Asigna el evento al botón
document.getElementById('btnHeaderLogin').addEventListener('click', loginWithGoogle);
