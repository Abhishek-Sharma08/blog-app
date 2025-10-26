import React, { useState } from 'react'
import appwriteService from "../appwrite/config"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

function PostCard({ $id, title, featuredImage, userId }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    
    // Get current user from Redux
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = userData && userId ? userData.$id === userId : false;

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const status = await appwriteService.deletePost($id);
            
            if (status) {
                await appwriteService.deleteFile(featuredImage);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
            <Link to={`/post/${$id}`} className='block h-full'>
                <div className='h-full w-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out group transform hover:-translate-y-2 animate-fadeInUp relative'>
                    
                    {/* Delete Button - ONLY SHOW IF USER IS AUTHOR */}
                    {isAuthor && (
                        <button
                            onClick={handleDeleteClick}
                            className='absolute top-4 left-4 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300'
                            title="Delete Post"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}

                    {/* Image with subtle overlay on hover */}
                    <div className='w-full aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative'>
                        <img
                            src={appwriteService.getFileView(featuredImage)}
                            alt={title}
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300'>
                            Article
                        </div>
                    </div>

                    <div className='p-5 sm:p-6'>
                        <h2 className='text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-3 leading-tight'>
                            {title}
                        </h2>

                        <div className='flex items-center gap-2 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
                            <span>Read More</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className='h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out'></div>
                </div>
            </Link>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCancelDelete}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-bounceIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Delete Post?
                        </h3>

                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete <span className="font-semibold">"{title}"</span>? This action cannot be undone.
                        </p>

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
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
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
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                .animate-bounceIn {
                    animation: bounceIn 0.4s ease-out;
                }
            `}</style>
        </>
    )
}

export default PostCard
