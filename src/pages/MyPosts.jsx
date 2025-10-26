import React, { useEffect, useState } from 'react';
import { Container } from '../components';
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchUser = async () => {
            if (userData && userData.$id) {
                setCurrentUser(userData);
            } else {
                const user = await authService.getCurrentUser();
                if (user) {
                    setCurrentUser(user);
                }
            }
        };
        fetchUser();
    }, [userData]);

    useEffect(() => {
        if (currentUser && currentUser.$id) {
            appwriteService.getUserPosts(currentUser.$id).then((response) => {
                if (response && response.documents) {
                    setPosts(response.documents);
                } else {
                    setPosts([]);
                }
                setLoading(false);
            }).catch(error => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-blue-500 mb-4"></div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-700">Loading your posts...</h1>
                    <p className="text-sm text-gray-500 mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen'>
            <Container>
                <div className="mb-6 sm:mb-12 text-center animate-fadeInDown">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 sm:mb-4 shadow-lg animate-bounce-slow">
                        <svg className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight animate-fadeIn">
                        My Posts
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fadeIn animation-delay-200">
                        {posts.length > 0 
                            ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}` 
                            : 'No posts yet'}
                    </p>

                    <div className="mt-3 sm:mt-4 mx-auto w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-expand"></div>
                </div>

                {posts.length > 0 ? (
                    <>
                        {/* MOBILE: Compact Vertical List */}
                        <div className="block md:hidden space-y-3">
                            {posts.map((post) => (
                                <Link 
                                    key={post.$id}
                                    to={`/post/${post.$id}`}
                                    className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 active:scale-[0.98]"
                                >
                                    {/* Small Image - Left */}
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img
                                            src={appwriteService.getFileView(post.featuredImage)}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content - Right */}
                                    <div className="flex-1 p-3 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 leading-tight">
                                                {post.title}
                                            </h3>
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

                        {/* DESKTOP: Grid Layout */}
                        <div className='hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeInUp animation-delay-400'>
                            {posts.map((post, index) => (
                                <Link
                                    key={post.$id}
                                    to={`/post/${post.$id}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    className="animate-fadeInUp block"
                                >
                                    <div className='h-full w-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out group transform hover:-translate-y-2'>
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
                    </>
                ) : (
                    <div className="text-center py-16 animate-fadeIn">
                        <div className="inline-flex items-center justify-center w-32 h-32 mb-6 bg-gray-100 rounded-full">
                            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Posts Yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start sharing your thoughts and ideas with the world by creating your first post!
                        </p>
                        
                        <Link to="/add-post">
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Your First Post
                            </button>
                        </Link>
                    </div>
                )}
            </Container>

            <style>{`
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

                @keyframes expand {
                    from { width: 0; }
                    to { width: 6rem; }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-fadeInDown {
                    animation: fadeInDown 0.6s ease-out;
                }

                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }

                .animate-expand {
                    animation: expand 1s ease-out;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }

                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
            `}</style>
        </div>
    );
}

export default MyPosts;
