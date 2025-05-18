import { db, auth, initAuth } from './firebase.js';
import { loadPost } from './postView.js';
import {
  listenToComments,
  addComment,
  editComment,
  deleteComment,
  setCurrentUser
} from './comments.js';

const postId = new URLSearchParams(location.search).get("id");

initAuth(user => {
  setCurrentUser(user);
  if (postId) {
    loadPost(postId);
    listenToComments(postId);
  }
});

document.getElementById("orderSelect").addEventListener("change", () => {
  if (postId) listenToComments(postId);
});

window.addComment = () => {
  const input = document.getElementById("new-comment");
  const text = input.value.trim();
  if (!text) return;
  addComment(postId, text).then(() => {
    input.value = "";
  });
};

window.editComment = editComment;
window.deleteComment = deleteComment;