//Credenciales de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCL2CctB5ULQg2tkWKKTX20-Aot0aGsVYw",
    authDomain: "registrocon-97cb2.firebaseapp.com",
    projectId: "registrocon-97cb2",
    storageBucket: "registrocon-97cb2.firebasestorage.app",
    messagingSenderId: "373644979789",
    appId: "1:373644979789:web:5b08ef46eb8852c59fb604",
    measurementId: "G-X5Q3RL90PV"
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