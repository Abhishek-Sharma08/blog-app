import React, { useState, useEffect } from "react";
import service from "../appwrite/config";
import conf from "../conf/conf";
import { Query } from "appwrite";  // Import Query directly

function Like({ postId, userId }) {
  const [ liked, setLiked ] = useState(false);
  const [ likesCount, setLikesCount ] = useState(0);
  const [ likeDocId, setLikeDocId ] = useState(null);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    async function fetchLikes() {
      const res = await service.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        [ Query.equal("postId", postId) ]
      );
      setLikesCount(res.total);
      const userLike = res.documents.find((doc) => doc.userId === userId);
      setLiked(!!userLike);
      setLikeDocId(userLike ? userLike.$id : null);
    }
    fetchLikes();
  }, [ postId, userId ]);

  async function handleLike() {
    setLoading(true);

    // Optimistically update UI
    if (liked) {
      setLiked(false);
      setLikesCount(c => Math.max(0, c - 1));
    } else {
      setLiked(true);
      setLikesCount(c => c + 1);
    }

    try {
      if (liked && likeDocId) {
        await service.deleteLike(likeDocId);
        setLikeDocId(null);
      } else {
        const newLike = await service.createLike(postId, userId);
        setLikeDocId(newLike.$id);
      }
    } catch (error) {
      // Rollback on failure
      if (liked) {
        setLiked(true);
        setLikesCount(c => c + 1);
      } else {
        setLiked(false);
        setLikesCount(c => Math.max(0, c - 1));
      }
      console.error("Error updating like:", error);
    }

    setLoading(false);
  }



  return (
    <button
      onClick={handleLike}
      disabled={loading}
      aria-label={liked ? "Unlike post" : "Like post"}
      className={`flex items-center gap-2 rounded-md px-4 py-2 
        text-sm md:text-base font-semibold select-none
        transition-colors duration-300 ease-in-out
        ${liked
          ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-rose-500 disabled:opacity-60 disabled:cursor-not-allowed
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 transition-transform duration-300 ${liked ? "scale-110 fill-current text-white" : "text-gray-700"
          }`}
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
      <span>{likesCount}</span>
    </button>
  );
}

export default Like;
