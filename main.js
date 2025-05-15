//Credenciales de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBIgjdichl8zTRn2VysK2ARnZPJpJIq0Q",
    authDomain: "vexo-a9eff.firebaseapp.com",
    projectId: "vexo-a9eff",
    storageBucket: "vexo-a9eff.firebasestorage.app",
    messagingSenderId: "1016481624740",
    appId: "1:1016481624740:web:7ccc7ba8a5dfb51ed12c31",
    measurementId: "G-24G8677F1B"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();


//Funcion Iniciar Sesion con google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert(e.message));
}

//evento de escucha para cuando de click se loguee 
btnHeaderLogin.addEventListener('click', loginWithGoogle);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

