import React, { useState, useEffect } from "react";
import service from "../appwrite/config";
import conf from "../conf/conf";

function Comment({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);

  async function fetchComments() {
    const res = await service.getComments(postId);
    setComments(res.documents);
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function addComment(e) {
    e.preventDefault();
    if (!input.trim()) return;

    await service.createComment(postId, userId, input.trim());
    setInput("");
    fetchComments();
  }

  async function confirmDeleteComment() {
    if (!commentToDelete) return;

    await service.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCommentsCollectionId,
      commentToDelete
    );
    setCommentToDelete(null);
    fetchComments();
    setToastMessage("Comment deleted successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  }

  function cancelDelete() {
    setCommentToDelete(null);
  }

  function requestDelete(commentId) {
    setCommentToDelete(commentId);
  }

  function startEditing(id, content) {
    setEditingCommentId(id);
    setEditingText(content);
  }

  async function saveEdit(id) {
    if (!editingText.trim()) return;

    await service.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCommentsCollectionId,
      id,
      { content: editingText.trim() }
    );
    setEditingCommentId(null);
    setEditingText("");
    fetchComments();
    setToastMessage("Comment updated successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  }

  function cancelEdit() {
    setEditingCommentId(null);
    setEditingText("");
  }

  return (
    <>
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fadeInDown z-50">
          {toastMessage}
        </div>
      )}

      <section className="mt-6">
        <form onSubmit={addComment} className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            placeholder="Add a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Post
          </button>
        </form>

        {/* Delete confirmation box */}
        {commentToDelete && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded shadow">
            <p className="mb-2 font-semibold">Delete this comment?</p>
            <div className="flex gap-2">
              <button
                onClick={confirmDeleteComment}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Yes, delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div>
          {comments.map((c) => (
            <div key={c.$id} className="p-3 border-b flex flex-col gap-2">
              {editingCommentId === c.$id ? (
                <>
                  <textarea
                    className="w-full border rounded p-2"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(c.$id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700">{c.content}</p>
                  {c.userId === userId && !commentToDelete && !editingCommentId && (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => startEditing(c.$id, c.content)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => requestDelete(c.$id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInDown {
            animation: fadeInDown 0.3s ease forwards;
          }
        `}
      </style>
    </>
  );
}

export default Comment;
