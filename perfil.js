// Firebase ya está inicializado
let currentUser = null;

const auth = firebase.auth();

auth.onAuthStateChanged(user => {
    if (user) {
        // Mostrar nombre y foto
        document.getElementById('userName').textContent = user.displayName;
        document.getElementById('userPic').src = user.photoURL;

        currentUser = user;

        // Revisar si es nuevo usuario y crear su perfil vacío
        checkUserInFirestore(user);

        // Cargar perfil si existe
        loadUserProfile(user.uid);
    } else {
        console.log("No hay usuario autenticado.");
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
                bio: '',
                interests: []
            }).then(() => {
                // Mostrar formulario para que complete su perfil
                document.getElementById('editProfileForm').style.display = 'block';
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
            inputBio.value = d.bio || '';
            inputInterests.value = d.interests.join(', ') || '';
            inputLocation.value = d.location || '';


            // 👇 Mostrar formulario también si ya hay perfil
            document.getElementById('editProfileForm').style.display = 'block';
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

const data = { 
    bio: inputBio.value, 
    location: inputLocation.value, 
    interests: arr, 
    updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
};

const profilePhoto = document.getElementById('userPic');
const profileName = document.getElementById('userName');
const profileEmail = document.getElementById('profileEmail'); // este no está en el HTML, agrégalo o quítalo
const inputBio = document.getElementById('inputBio');
const inputInterests = document.getElementById('inputInterests');
const inputLocation = document.getElementById('inputLocation');
const profileSuccess = document.getElementById('profileSuccess');
const profileError = document.getElementById('profileError');
const profileLoader = document.getElementById('profileLoader'); // si lo usas, debe existir
