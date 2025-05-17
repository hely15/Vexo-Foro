// Firebase ya está inicializado

const auth = firebase.auth();

auth.onAuthStateChanged(user => {
    if (user) {
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;

        document.getElementById('userName').textContent = displayName;
        document.getElementById('user-email').textContent = email;
        document.getElementById('userPic').src = photoURL;
    } else {
        // Usuario no autenticado, redirige o muestra un mensaje
        console.log("No hay usuario autenticado.");
        window.location.href = "index.html"; // o muestra un aviso
    }
});
