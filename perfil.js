// Firebase ya está inicializado
let currentUser = null;

const firebaseConfig = {
    apiKey: "AIzaSyCL2CctB5ULQg2tkWKKTX20-Aot0aGsVYw",
    authDomain: "registrocon-97cb2.firebaseapp.com",
    projectId: "registrocon-97cb2",
    storageBucket: "registrocon-97cb2.firebasestorage.app",
    messagingSenderId: "373644979789",
    appId: "1:373644979789:web:5b08ef46eb8852c59fb604",
    measurementId: "G-X5Q3RL90PV"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Referencias DOM
const userPic = document.getElementById('userPic');
const userName = document.getElementById('userName');
const profileBio = document.getElementById('profileBio');
const profileInterests = document.getElementById('profileInterests');
const inputBio = document.getElementById('inputBio');
const inputLocation = document.getElementById('inputLocation');
const inputInterests = document.getElementById('inputInterests');
const btnSaveProfile = document.getElementById('btnSaveProfile');
const profileLoader = document.getElementById('profileLoader');
const profileError = document.getElementById('profileError');
const profileSuccess = document.getElementById('profileSuccess');
const postError = document.getElementById('postError');

// Verificar estado de autenticación
auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        console.log("Usuario autenticado:", user.displayName);
        
        // Actualizar la interfaz con la información del usuario
        userName.textContent = user.displayName || 'Usuario';
        userPic.src = user.photoURL || 'storage/img/FotoDePerfilEjem.png';
        
        // Verificar si el usuario existe en Firestore y cargar su perfil
        checkUserInFirestore(user);
        loadUserProfile(user.uid);
    } else {
        console.log("No hay usuario autenticado");
        // Puedes redirigir al usuario a la página de login o mostrar un mensaje
        alert("Debes iniciar sesión para ver y editar tu perfil");
        // window.location.href = "login.html"; // Descomenta si deseas redirigir
    }
});

// Verificar/crear usuario en Firestore
function checkUserInFirestore(user) {
    db.collection('users').doc(user.uid).get().then(doc => {
        if (!doc.exists) {
            console.log("Creando nuevo perfil para", user.displayName);
            db.collection('users').doc(user.uid).set({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                bio: '', 
                location: '', 
                interests: []
            }).then(() => {
                console.log("Perfil creado exitosamente");
                loadUserProfile(user.uid); // Cargar el perfil recién creado
            }).catch(error => {
                console.error("Error creando perfil:", error);
                showErrorMessage(profileError, 'Error al crear perfil');
            });
        }
    }).catch(error => {
        console.error("Error verificando usuario:", error);
    });
}

// Cargar perfil del usuario
function loadUserProfile(uid) {
    if (profileLoader) profileLoader.style.display = 'block';
    
    db.collection('users').doc(uid).get()
        .then(doc => {
            if (profileLoader) profileLoader.style.display = 'none';
            
            if (doc.exists) {
                const userData = doc.data();
                
                // Mostrar datos en la vista del perfil
                if (profileBio) profileBio.textContent = userData.bio || 'Sin biografía';
                if (profileInterests) profileInterests.textContent = Array.isArray(userData.interests) ? 
                    userData.interests.join(', ') : 
                    (userData.interests || 'Sin intereses');
                
                // Cargar datos en el formulario de edición
                if (inputBio) inputBio.value = userData.bio || '';
                if (inputLocation) inputLocation.value = userData.location || '';
                if (inputInterests) inputInterests.value = Array.isArray(userData.interests) ? 
                    userData.interests.join(', ') : 
                    (userData.interests || '');
                
                console.log("Perfil cargado correctamente");
            } else {
                console.log("No se encontró el documento del usuario");
                showErrorMessage(profileError, 'No se encontró el perfil');
            }
        })
        .catch(error => {
            if (profileLoader) profileLoader.style.display = 'none';
            console.error("Error cargando perfil:", error);
            showErrorMessage(profileError, 'Error al cargar perfil');
        });
}

// Guardar cambios del perfil
btnSaveProfile.addEventListener('click', () => {
    if (!currentUser) {
        showErrorMessage(profileError, 'Debes iniciar sesión');
        return;
    }
    
    // Mostrar loader y ocultar mensajes
    if (profileLoader) profileLoader.style.display = 'block';
    hideMessages();
    
    // Procesar intereses (dividir por comas y eliminar espacios en blanco)
    const interestsArray = inputInterests.value
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
    
    // Datos a actualizar
    const profileData = {
        bio: inputBio.value,
        location: inputLocation.value,
        interests: interestsArray,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Actualizar en Firestore
    db.collection('users').doc(currentUser.uid).update(profileData)
        .then(() => {
            if (profileLoader) profileLoader.style.display = 'none';
            showSuccessMessage(profileSuccess, 'Perfil actualizado correctamente');
            
            // Actualizar la vista del perfil con los nuevos datos
            if (profileBio) profileBio.textContent = profileData.bio || 'Sin biografía';
            if (profileInterests) profileInterests.textContent = profileData.interests.join(', ') || 'Sin intereses';
            
            console.log("Perfil actualizado correctamente");
        })
        .catch(error => {
            if (profileLoader) profileLoader.style.display = 'none';
            console.error("Error al actualizar perfil:", error);
            showErrorMessage(profileError, 'Error al guardar cambios');
        });
});

// Funciones de utilidad para mostrar/ocultar mensajes
function hideMessages() {
    const messages = [profileError, profileSuccess, postError];
    messages.forEach(el => {
        if (el) el.style.display = 'none';
    });
}

function showErrorMessage(el, msg) {
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
        el.style.backgroundColor = '#ffebee';
        el.style.color = '#c62828';
        el.style.padding = '10px';
        el.style.borderRadius = '5px';
        el.style.marginBottom = '15px';
    }
}

function showSuccessMessage(el, msg) {
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
        el.style.backgroundColor = '#e8f5e9';
        el.style.color = '#2e7d32';
        el.style.padding = '10px';
        el.style.borderRadius = '5px';
        el.style.marginBottom = '15px';
    }
}

// Para probar con un usuario ficticio cuando no hay autenticación (solo para desarrollo)
function testWithMockUser() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true' && !currentUser) {
        console.log("Modo de prueba activado");
        const mockUser = {
            uid: 'test-user-123',
            displayName: 'Usuario de Prueba',
            email: 'test@example.com',
            photoURL: 'storage/img/FotoDePerfilEjem.png'
        };
        
        // Simular usuario autenticado
        currentUser = mockUser;
        userName.textContent = mockUser.displayName;
        userPic.src = mockUser.photoURL;
        
        // Crear datos de prueba
        checkUserInFirestore(mockUser);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, inicializando perfil");
    
    // Para desarrollo, puedes usar la función de prueba
    // testWithMockUser();
});