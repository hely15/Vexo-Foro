// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBIgjdichl8zTRn2VysK2ARnZPJpJIq0Q",
    authDomain: "vexo-a9eff.firebaseapp.com",
    projectId: "vexo-a9eff",
    storageBucket: "vexo-a9eff.firebasestorage.app",
    messagingSenderId: "1016481624740",
    appId: "1:1016481624740:web:7ccc7ba8a5dfb51ed12c31",
    measurementId: "G-24G8677F1B"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Función para login con Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log("Usuario autenticado:", user);
        })
        .catch(error => {
            console.error("Error al iniciar sesión:", error);
        });
}

// Escuchar click del botón
document.getElementById('btnHeaderLogin').addEventListener('click', loginWithGoogle);
