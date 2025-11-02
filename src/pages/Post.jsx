import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import Like from "../components/Like";
import Comment from "../components/Comment";

export default function Post() {
    const [ post, setPost ] = useState(null);
    const [ currentUserId, setCurrentUserId ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const [ isDeleting, setIsDeleting ] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchUserId = async () => {
            if (userData && userData.$id) {
                setCurrentUserId(userData.$id);
            } else {
                const user = await authService.getCurrentUser();
                if (user && user.$id) {
                    setCurrentUserId(user.$id);
                }
            }
        };
        fetchUserId();
    }, [ userData ]);

    const isAuthor = post && currentUserId ? post.userId === currentUserId : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((p) => {
                if (p) setPost(p);
                else navigate("/");
                setLoading(false);
            });
        } else navigate("/");
    }, [ slug, navigate ]);

    const handleDeleteClick = () => setShowDeleteModal(true);
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                await appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };
    const handleCancelDelete = () => setShowDeleteModal(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-blue-500 mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading post...</p>
                </div>
            </div>
        );
    }

    return post ? (
        <div className="py-6 sm:py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <Container>
                {/* Back Button */}
                <div className="mb-6 md:mb-8 animate-fadeIn">
                    <Link to="/" className="group inline-flex items-center text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium text-sm md:text-base">
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Posts
                    </Link>
                </div>

                {/* Main Post Card */}
                <article className="max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden animate-fadeInUp">
                    <div className="flex flex-col md:flex-row md:max-h-[600px]">
                        {/* Image Container with fixed height and minWidth */}
                        <div className="md:w-[35%] flex-shrink-0 relative group overflow-hidden">
                            <img
                                src={appwriteService.getFileView(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-56 sm:h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>


                        {/* Content Section */}
                        <div className="md:w-[65%] p-5 sm:p-6 md:p-8 flex flex-col overflow-hidden">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight break-words animate-fadeIn animation-delay-200">
                                {post.title}
                            </h1>

                            {/* Metadata */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-200 gap-3 animate-fadeIn animation-delay-400">
                                <div className="inline-flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
                                    <svg className="w-4 h-4 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-medium">
                                        {new Date(post.$createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                {isAuthor && (
                                    <div className="flex flex-wrap gap-2 animate-fadeIn animation-delay-600">
                                        <Link to={`/edit-post/${post.$id}`}>
                                            <Button className="bg-green-500 hover:bg-green-600">Edit</Button>
                                        </Link>
                                        <Button className="bg-red-500 hover:bg-red-600" onClick={handleDeleteClick} disabled={isDeleting}>
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Post Content */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar animate-fadeIn animation-delay-800">
                                <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal">
                                    <div className="text-gray-800 leading-relaxed break-words text-sm sm:text-base">
                                        {parse(post.content)}
                                    </div>
                                </div>
                            </div>

                            {/* Like inside the post card */}
                            <div className="mt-6">
                                <Like postId={post.$id} userId={currentUserId} />
                            </div>
                        </div>
                    </div>
                </article>

                {/* Comments outside the post card */}
                <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg animate-fadeInUp">
                    <div className="mt-6">
                        <Comment postId={post.$id} userId={currentUserId} />
                    </div>
                </div>
            </Container>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
                    onClick={handleCancelDelete}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-bounceIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Warning Icon */}
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Post?</h3>

                        {/* Message */}
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete <span className="font-semibold">"{post.title}"</span>? This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations & Custom Scrollbar */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.4s ease-out;
        }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
        </div>
    ) : null;
}

