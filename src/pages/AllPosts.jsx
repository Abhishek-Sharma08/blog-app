import React, { useState, useEffect } from 'react';
import { Container } from '../components';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const response = await appwriteService.getPosts([]);
      let sortedPosts = [];

      if (response && response.documents) {
        sortedPosts = response.documents.sort((a, b) =>
          new Date(b.$createdAt) - new Date(a.$createdAt)
        );
      }

      setPosts(sortedPosts);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-24 min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading all posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-16 sm:py-24 min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center max-w-xl mx-auto animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              No Posts Found
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-10 leading-relaxed">
              Check back later for new content!<br />
              <span className="text-blue-600 font-medium">Be the first</span> to create a post.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12'>
      <Container>
        <div className="mb-6 sm:mb-12 animate-slide-in-left">
          <div className="sm:hidden mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">All Posts</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {posts.length}
              </span>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-expand"></div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-baseline gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                All Posts
              </h1>
              <span className="inline-flex items-center px-4 py-1 rounded-full text-lg font-semibold bg-blue-100 text-blue-800 animate-pulse">
                {posts.length}
              </span>
            </div>
            <p className="text-gray-600 text-lg md:text-xl mb-4">Browse through all our published articles</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-expand"></div>
          </div>
        </div>
        <div className="block md:hidden space-y-3">
          {posts.map((post) => (
            <Link
              key={post.$id}
              to={`/post/${post.$id}`}
              className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 active:scale-[0.98]"
            >
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={appwriteService.getFileView(post.featuredImage)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 leading-tight">
                    {post.title}
                  </h3>
                  <div className="text-xs text-gray-500">
                    By: {post.authorName ? post.authorName : "Unknown"}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(post.$createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <div className="flex items-center gap-1 text-blue-600">
                    <span className="text-xs font-semibold">Read</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8'>
          {posts.map((post) => (
            <Link
              key={post.$id}
              to={`/post/${post.$id}`}
              className="animate-fade-in-up transform transition-all duration-500 hover:scale-105 block"
            >
              <div className='h-full w-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out group'>
                <div className='w-full aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative'>
                  <img
                    src={appwriteService.getFileView(post.featuredImage)}
                    alt={post.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
                  />
                </div>
                <div className='p-5'>
                  <h2 className='text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-3'>
                    {post.title}
                  </h2>
                  <div className="text-xs text-gray-500">
                    By: {post.authorName ? post.authorName : "Unknown"}
                  </div>
                  <div className='flex items-center justify-end gap-2 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300'>
                    <span>Read More</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px);}
          to { opacity: 1; transform: translateX(0);}
        }
        @keyframes expand { from { width: 0; } to { width: 6rem; } }
        .animate-fade-in { animation: fade-in 1s ease-out;}
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out both;}
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out;}
        .animate-expand { animation: expand 1s ease-out;}
      `}</style>
    </div>
  );
}

export default AllPosts;
