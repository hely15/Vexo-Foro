// Firebase ya está inicializado

const auth = firebase.auth();

auth.onAuthStateChanged(user => {
    if (user) {
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;

        document.getElementById('userName').textContent = displayName;
        document.getElementById('userPic').src = photoURL;
    } else {
        // Usuario no autenticado, redirige o muestra un mensaje
        console.log("No hay usuario autenticado.");
        //window.location.href = "index.html"; // o muestra un aviso
    }
});

const db = firebase.firestore();

// ————— Perfil —————
function checkUserInFirestore(u) {
    db.collection('users').doc(u.uid).get().then(doc => {
        if (!doc.exists) {
            db.collection('users').doc(u.uid).set({
                uid: u.uid,
                displayName: u.displayName,
                email: u.email,
                photoURL: u.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                bio: '', interests: []
            });
        }
    });
}
function loadUserProfile(uid) {
    profileLoader.style.display = 'block';
    db.collection('users').doc(uid).get()
        .then(doc => {
            profileLoader.style.display = 'none';
            const d = doc.data();
            profilePhoto.src = d.photoURL;
            profileName.textContent = d.displayName;
            profileEmail.textContent = d.email;
            profileBio.textContent = d.bio || '—';
            profileInterests.textContent = d.interests.join(', ') || '—';
            inputBio.value = d.bio;
            inputInterests.value = d.interests.join(', ');
        })
        .catch(e => {
            profileLoader.style.display = 'none';
            showErrorMessage(profileError, 'No se pudo cargar perfil');
        });
}
btnSaveProfile.addEventListener('click', () => {
    if (!currentUser) return showErrorMessage(profileError, 'Inicia sesión');
    profileLoader.style.display = 'block'; hideMessages();
    const arr = inputInterests.value.split(',').map(i => i.trim()).filter(i => i);
    const data = { bio: inputBio.value, location: inputLocation.value, interests: arr, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    db.collection('users').doc(currentUser.uid).update(data)
        .then(() => {
            profileLoader.style.display = 'none';
            showSuccessMessage(profileSuccess, 'Perfil actualizado');
            loadUserProfile(currentUser.uid);
        })
        .catch(e => {
            profileLoader.style.display = 'none'; showErrorMessage(profileError, 'Error al guardar');
        });
});

const profileBio = document.getElementById('profileBio');
const profileInterests= document.getElementById('profileInterests');
