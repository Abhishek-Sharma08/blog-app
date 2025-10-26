import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components'


function Home() {
    const [ posts, setPosts ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                // Sort by createdAt descending and take ONLY 2 latest posts
                const sortedPosts = posts.documents
                    .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
                    .slice(0, 2); // ✅ Changed from 8 to 2
                setPosts(sortedPosts);
            }
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div className="w-full py-24 min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-blue-500 mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading posts...</p>
                </div>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-16 sm:py-24 min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <Container>
                    <div className="text-center max-w-xl mx-auto animate-fadeInUp">
                        {/* Icon */}
                        <div className="mb-8 sm:mb-10 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 sm:w-40 h-32 sm:h-40 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                            </div>
                            <svg className="relative mx-auto h-24 sm:h-32 w-24 sm:w-32 text-gray-400 animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        {/* Text */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight animate-fadeIn">
                            No Posts Yet
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed animate-fadeIn animation-delay-200">
                            Be the first to share your thoughts.<br />
                            <span className="text-blue-600 font-medium">Login</span> to create amazing blog posts.
                        </p>

                        {/* CTA Button */}
                        <Link to="/login">
                            <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 animate-fadeIn animation-delay-400">
                                <span className="flex items-center gap-2">
                                    Get Started
                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        </Link>

                        {/* Decorative dots */}
                        <div className="flex justify-center gap-2 mt-8 opacity-40 animate-fadeIn animation-delay-600">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-0"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen'>
            <Container>
                {/* Hero Section - HIDDEN ON MOBILE */}
                <div className="hidden sm:block mb-12 animate-fadeIn">
                    <div className="flex items-baseline gap-3 mb-3">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                            Latest Posts
                        </h1>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Top 2
                        </span>
                    </div>
                    <p className="text-gray-600 text-lg md:text-xl">Discover our most recent articles</p>

                    {/* Decorative underline */}
                    <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>

                {/* Mobile Title - ONLY ON MOBILE */}
                <div className="sm:hidden mb-6 animate-fadeIn">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">Latest Posts</h1>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Top 2
                        </span>
                    </div>
                </div>

                {/* Posts Grid - Only 2 posts, responsive layout */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto'>
                    {posts.map((post, index) => (
                        <div
                            key={post.$id}
                            className="transform transition-all duration-500 hover:scale-105"
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                            }}
                        >
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>

                {/* View All Posts Button */}
                <div className="mt-12 sm:mt-16 text-center animate-fadeIn animation-delay-600">
                    <Link to="/all-posts">
                        <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:bg-gray-800 transform hover:scale-105 transition-all duration-300">
                            <span className="flex items-center gap-2 sm:gap-3">
                                View All Posts
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </Link>
                </div>
            </Container>

            {/* Animations */}
            <style>{`
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
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                .animation-delay-0 { animation-delay: 0s; }
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
                .animation-delay-600 { animation-delay: 0.6s; }
            `}</style>
        </div>
    )
}

export default Home
