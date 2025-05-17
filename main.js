// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCL2CctB5ULQg2tkWKKTX20-Aot0aGsVYw",
    authDomain: "registrocon-97cb2.firebaseapp.com",
    projectId: "registrocon-97cb2",
    storageBucket: "registrocon-97cb2.firebasestorage.app",
    messagingSenderId: "373644979789",
    appId: "1:373644979789:web:5b08ef46eb8852c59fb604",
    measurementId: "G-X5Q3RL90PV"
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

            const displayName = user.displayName;
            const email = user.email;
            const photoURL = user.photoURL;


            document.getElementById('userName').textContent = displayName;
            document.getElementById('user-email').textContent = email;
            document.getElementById('userPic').src = photoURL;

            console.log("Usuario autenticado:", { displayName, email, photoURL });
        })
        .catch(error => {
            console.error("Error al iniciar sesión:", error);
        });
}


document.getElementById('btnHeaderLogin').addEventListener('click', loginWithGoogle);

