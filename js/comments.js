import { db } from './firebase.js';
import {
  collection, addDoc, updateDoc, deleteDoc, serverTimestamp,
  onSnapshot, query, orderBy, doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let currentUser = null;
let unsubscribeComments = null;

export function setCurrentUser(user) {
  currentUser = user;
}

export function listenToComments(postId) {
  const container = document.getElementById("comments");
  const order = document.getElementById("orderSelect").value;

  if (unsubscribeComments) unsubscribeComments();

  const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", order));

  unsubscribeComments = onSnapshot(q, snapshot => {
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = "<p>No hay comentarios aún.</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      const c = docSnap.data();
      const cid = docSnap.id;
      const date = c.createdAt?.toDate().toLocaleString() || '';
      const div = document.createElement("div");
      div.className = "comment";
      div.innerHTML = `
        <div class="comment-header">
          <img src="${c.authorPhotoURL || 'https://via.placeholder.com/40'}" alt="Foto de perfil">
          <div>
            <strong>${c.authorName}</strong><br>
            <small>${date}</small>
          </div>
        </div>
        <div class="comment-body" id="text-${cid}">${c.text}</div>
        ${currentUser && currentUser.uid === c.authorId ? `
          <div class="comment-buttons">
            <button class="btn-small edit-btn" onclick="editComment('${cid}', \`${c.text.replace(/`/g, '\\`')}\`)">
              <img src="pencil.svg" alt="Editar">
            </button>
            <button class="btn-small delete-btn" onclick="deleteComment('${cid}')">
              <img src="trash.svg" alt="Eliminar">
            </button>
          </div>` : ""
        }
      `;
      container.appendChild(div);
    });
  });
}

export async function addComment(postId, text) {
  if (!text || !currentUser) return alert("Debes iniciar sesión y escribir un comentario.");
  await addDoc(collection(db, "posts", postId, "comments"), {
    text,
    createdAt: serverTimestamp(),
    authorId: currentUser.uid,
    authorName: currentUser.displayName,
    authorPhotoURL: currentUser.photoURL || ""
  });
}

export async function editComment(commentId, oldText) {
  const newText = prompt("Editar comentario:", oldText);
  if (newText !== null) {
    const ref = doc(db, "posts", postId, "comments", commentId);
    await updateDoc(ref, {
      text: newText,
      editedAt: serverTimestamp()
    });
  }
}

export async function deleteComment(commentId) {
  if (confirm("¿Seguro que deseas eliminar este comentario?")) {
    const ref = doc(db, "posts", postId, "comments", commentId);
    await deleteDoc(ref);
  }
}