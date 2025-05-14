
//Funcion Iniciar Sesion con google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert(e.message));
}

//evento de escucha para cuando de click se loguee 
btnHeaderLogin.addEventListener('click', loginWithGoogle);