const firebaseConfig = {
    apiKey: "AIzaSyCL2CctB5ULQg2tkWKKTX20-Aot0aGsVYw",
    authDomain: "registrocon-97cb2.firebaseapp.com",
    projectId: "registrocon-97cb2",
    storageBucket: "registrocon-97cb2.firebasestorage.app",
    messagingSenderId: "373644979789",
    appId: "1:373644979789:web:5b08ef46eb8852c59fb604",
    measurementId: "G-X5Q3RL90PV",
  }
  firebase.initializeApp(firebaseConfig)
  const auth = firebase.auth()
  const db = firebase.firestore()
  
  // ————— Referencias DOM —————
  const btnHeaderLogin = document.getElementById("btnHeaderLogin")
  const btnMainLogin = document.getElementById("btnMainLogin")
  const btnLogout = document.getElementById("btnLogout")
  const userInfo = document.getElementById("userInfo")
  const userName = document.getElementById("userName")
  const userNameBig = document.getElementById("userNameBig")
  const userPhoto = document.getElementById("userPhoto")
  const userPhotoLarge = document.getElementById("userPhotoLarge")
  const navHome = document.getElementById("navHome")
  const navForum = document.getElementById("navForum")
  const navProfile = document.getElementById("navProfile")
  const welcomeBox = document.getElementById("welcomeBox")
  const signedInContent = document.getElementById("signedInContent")
  const profileSection = document.getElementById("profileSection")
  const forumSection = document.getElementById("forumSection")
  const profilePhoto = document.getElementById("profilePhoto")
  const profileName = document.getElementById("profileName")
  const profileEmail = document.getElementById("profileEmail")
  const profileBio = document.getElementById("profileBio")
  const profileLocation = document.getElementById("profileLocation")
  const profileInterests = document.getElementById("profileInterests")
  const inputBio = document.getElementById("inputBio")
  const inputLocation = document.getElementById("inputLocation")
  const inputInterests = document.getElementById("inputInterests")
  const btnSaveProfile = document.getElementById("btnSaveProfile")
  const profileLoader = document.getElementById("profileLoader")
  const profileError = document.getElementById("profileError")
  const profileSuccess = document.getElementById("profileSuccess")
  const postTitle = document.getElementById("postTitle")
  const postTopic = document.getElementById("postTopic")
  const postContent = document.getElementById("postContent")
  const btnCreatePost = document.getElementById("btnCreatePost")
  const postsList = document.getElementById("postsList")
  const postsLoader = document.getElementById("postsLoader")
  const tabAllPosts = document.getElementById("tabAllPosts")
  const tabMyPosts = document.getElementById("tabMyPosts")
  const postError = document.getElementById("postError")
  const postSuccess = document.getElementById("postSuccess")
  const searchInput = document.getElementById("searchInput")
  const btnSearch = document.getElementById("btnSearch")
  const searchBox = document.getElementById("search-box")
  const filterChips = document.querySelectorAll(".filter-chip")
  
  let currentUser = null
  let currentTab = "all"
  let currentFilter = "all"
  let searchQuery = ""
  
  // Mapeo de IDs de temas a nombres
  const topicMap = {
    1: "Infraestructura del Internet",
    2: "Protocolos de Comunicación",
    3: "Funcionamiento de la Web",
    4: "APIs y Servicios Web",
    5: "Seguridad y Buenas Prácticas",
  }
  
  // ————— Estado de Auth —————
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user
      showUserInfo(user)
      btnHeaderLogin.style.display = "none"
      userInfo.style.display = "flex"
      btnMainLogin.style.display = "none"
      signedInContent.style.display = "block"
      navForum.style.display = "block"
      navProfile.style.display = "inline"
      navHome.style.display = "inline"
      searchBox.style.display = "inline"
      loadUserProfile(user.uid)
      loadPosts(currentTab, currentFilter, searchQuery)
      checkUserInFirestore(user)
    } else {
      currentUser = null
      btnHeaderLogin.style.display = "flex"
      userInfo.style.display = "none"
      btnMainLogin.style.display = "inline-flex"
      signedInContent.style.display = "none"
      navProfile.style.display = "none"
      searchBox.style.display = "none"
      navHome.style.display = "none"
      showSection("welcome")
    }
  })
  
  // ————— Login/Logout —————
  function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider).catch((e) => alert(e.message))
  }
  btnHeaderLogin.addEventListener("click", loginWithGoogle)
  btnMainLogin.addEventListener("click", loginWithGoogle)
  btnLogout.addEventListener("click", () => {
    auth.signOut()
    window.location.href = "index.html"
  })
  
  function showUserInfo(user) {
    userName.textContent = user.displayName
    userNameBig.textContent = user.displayName
    userPhoto.src = user.photoURL || ""
    userPhotoLarge.src = user.photoURL || ""
  }
  
  // ————— Secciones/Navegación —————
  function showSection(name) {
    welcomeBox.style.display = name === "welcome" ? "block" : "none"
    profileSection.style.display = name === "profile" ? "block" : "none"
    forumSection.style.display = name === "forum" ? "block" : "none"
    navHome.classList.toggle("active", name === "welcome")
    userName.classList.toggle("active", name === "profile")
    navForum.classList.toggle("active", name === "forum")
  }
  navHome.addEventListener("click", () => showSection("welcome"))
  userName.addEventListener("click", () => (window.location.href = "perfil.html"))
  navForum.addEventListener("click", () => showSection("forum"))
  
  // ————— Perfil —————
  function checkUserInFirestore(u) {
    db.collection("users")
      .doc(u.uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          db.collection("users").doc(u.uid).set({
            uid: u.uid,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            bio: "",
            location: "",
            interests: [],
          })
        }
      })
  }
  function loadUserProfile(uid) {
    profileLoader.style.display = "block"
    db.collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        profileLoader.style.display = "none"
        const d = doc.data()
        profilePhoto.src = d.photoURL
        profileName.textContent = d.displayName
        profileEmail.textContent = d.email
        profileBio.textContent = d.bio || "—"
        profileLocation.textContent = d.location || "—"
        profileInterests.textContent = d.interests.join(", ") || "—"
        inputBio.value = d.bio
        inputLocation.value = d.location
        inputInterests.value = d.interests.join(", ")
      })
      .catch((e) => {
        profileLoader.style.display = "none"
        showErrorMessage(profileError, "No se pudo cargar perfil")
      })
  }
  btnSaveProfile.addEventListener("click", () => {
    if (!currentUser) return showErrorMessage(profileError, "Inicia sesión")
    profileLoader.style.display = "block"
    hideMessages()
    const arr = inputInterests.value
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i)
    const data = {
      bio: inputBio.value,
      location: inputLocation.value,
      interests: arr,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
    db.collection("users")
      .doc(currentUser.uid)
      .update(data)
      .then(() => {
        profileLoader.style.display = "none"
        showSuccessMessage(profileSuccess, "Perfil actualizado")
        loadUserProfile(currentUser.uid)
      })
      .catch((e) => {
        profileLoader.style.display = "none"
        showErrorMessage(profileError, "Error al guardar")
      })
  })
  
  // ————— Posts —————
  btnCreatePost.addEventListener("click", () => {
    if (!currentUser) {
      showErrorMessage(postError, "Debes iniciar sesión")
      return
    }
  
    const title = postTitle.value.trim()
    const content = postContent.value.trim()
    const topic = postTopic.value.trim()
  
    if (!title) {
      showErrorMessage(postError, "Título obligatorio")
      return
    }
    if (!content) {
      showErrorMessage(postError, "Contenido obligatorio")
      return
    }
    if (!topic) {
      showErrorMessage(postError, "Debes seleccionar un tema")
      return
    }
  
    postsLoader.style.display = "block"
    hideMessages()
  
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        // Si no existe, usamos los datos de currentUser
        const u = doc.exists ? doc.data() : {}
        const authorName = u.displayName || currentUser.displayName || "Usuario anónimo"
        const authorPhotoURL = u.photoURL || currentUser.photoURL || ""
  
        const newPost = {
          title,
          content,
          topic,
          topicName: topicMap[topic],
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          authorId: currentUser.uid,
          authorName,
          authorPhotoURL,
        }
  
        return db.collection("posts").add(newPost)
      })
      .then(() => {
        postsLoader.style.display = "none"
        showSuccessMessage(postSuccess, "Publicado correctamente")
        postTitle.value = ""
        postContent.value = ""
        postTopic.value = ""
        loadPosts(currentTab, currentFilter, searchQuery)
      })
      .catch((error) => {
        postsLoader.style.display = "none"
        console.error("Error al crear publicación:", error)
        showErrorMessage(postError, "Error al publicar. Inténtalo de nuevo.")
      })
  })
  
  function loadPosts(tab, topicFilter, query) {
    postsList.innerHTML = ""
    postsLoader.style.display = "block"
  
    let q = db.collection("posts").orderBy("createdAt", "desc")
  
    // Filtrar por autor si es necesario
    if (tab === "my" && currentUser) {
      q = q.where("authorId", "==", currentUser.uid)
    }
  
    // Filtrar por tema si es necesario
    if (topicFilter !== "all") {
      q = q.where("topic", "==", topicFilter)
    }
  
    q.get()
      .then((snap) => {
        postsLoader.style.display = "none"
  
        if (snap.empty) {
          return (postsList.innerHTML = '<p style="text-align:center;color:#666">No hay posts.</p>')
        }
  
        let posts = []
        snap.forEach((d) => {
          posts.push({ id: d.id, ...d.data() })
        })
  
        // Filtrar por búsqueda si hay una consulta
        if (query) {
          const queryLower = query.toLowerCase()
          posts = posts.filter(
            (p) =>
              p.title.toLowerCase().includes(queryLower) ||
              p.content.toLowerCase().includes(queryLower) ||
              (p.topicName && p.topicName.toLowerCase().includes(queryLower)),
          )
        }
  
        if (posts.length === 0) {
          return (postsList.innerHTML =
            '<p style="text-align:center;color:#666">No hay resultados para esta búsqueda.</p>')
        }
  
        posts.forEach((p) => {
          const date = p.createdAt?.toDate().toLocaleString() || ""
          const div = document.createElement("div")
          div.className = "post-item"
  
          div.innerHTML = `
                <div class="post-header">
                  <img class="post-author-photo" src="${p.authorPhotoURL}" alt="">
                  <span class="post-author-name">${p.authorName}</span>
                  <span class="post-date">${date}</span>
                </div>
                ${p.topicName ? `<span class="post-topic">${p.topicName}</span>` : ""}
                <h3 class="post-title">${p.title}</h3>
                <p class="post-content">${p.content}</p>
              `
  
          const btn = document.createElement("a")
          btn.href = `post.html?id=${p.id}`
          btn.textContent = "Comentar"
          btn.className = "btn-save"
          btn.style.marginTop = "10px"
          btn.style.display = "inline-block"
  
          div.appendChild(btn)
          postsList.appendChild(div)
        })
      })
      .catch((e) => {
        postsLoader.style.display = "none"
        postsList.innerHTML = '<p style="text-align:center;color:#c62828">Error al cargar.</p>'
        console.error("Error al cargar posts:", e)
      })
  }
  
  // Filtros de pestañas (Todas/Mis publicaciones)
  tabAllPosts.addEventListener("click", () => {
    currentTab = "all"
    tabAllPosts.classList.add("active")
    tabMyPosts.classList.remove("active")
    loadPosts(currentTab, currentFilter, searchQuery)
  })
  
  tabMyPosts.addEventListener("click", () => {
    currentTab = "my"
    tabMyPosts.classList.add("active")
    tabAllPosts.classList.remove("active")
    loadPosts(currentTab, currentFilter, searchQuery)
  })
  
  // Búsqueda y filtros por tema
  btnSearch.addEventListener("click", () => {
    searchQuery = searchInput.value.trim()
    loadPosts(currentTab, currentFilter, searchQuery)
  })
  
  // Permitir búsqueda al presionar Enter
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchQuery = searchInput.value.trim()
      loadPosts(currentTab, currentFilter, searchQuery)
    }
  })
  
  // Filtros por tema (chips)
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      // Desactivar todos los chips
      filterChips.forEach((c) => c.classList.remove("active"))
  
      // Activar el chip seleccionado
      chip.classList.add("active")
  
      // Actualizar filtro actual
      currentFilter = chip.dataset.topic
  
      // Recargar posts con el nuevo filtro
      loadPosts(currentTab, currentFilter, searchQuery)
    })
  })
  
  // ————— Mensajes —————
  function hideMessages() {
    ;[postError, postSuccess, profileError, profileSuccess].forEach((el) => (el.style.display = "none"))
  }
  
  function showErrorMessage(el, msg) {
    el.textContent = msg
    el.style.display = "block"
  }
  
  function showSuccessMessage(el, msg) {
    el.textContent = msg
    el.style.display = "block"
  }
  
  // ————— Inicialización —————
  document.addEventListener("DOMContentLoaded", () => {
    showSection("welcome")
  })
  