import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export async function loadPost(postId) {
  const docRef = doc(db, "posts", postId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;

  const p = snap.data();
  document.getElementById("post").innerHTML = `
    <div class="comment-header">
      <img src="${p.authorPhotoURL || 'https://via.placeholder.com/40'}" alt="Foto autor">
      <div>
        <strong>${p.authorName}</strong><br>
        <small>${p.createdAt?.toDate().toLocaleString() || ''}</small>
      </div>
    </div>
    <div class="post-title">${p.title}</div>
    <div class="post-content">${p.content}</div>
  `;
}