import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate,  useParams } from 'react-router-dom';



function EditPost() {
    const [post, setPosts] = useState(null)
    const [loading, setLoading] = useState(true)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                } else {
                    navigate('/')
                }
                setLoading(false)
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-green-500 mb-4"></div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-700">Loading post...</h1>
                    <p className="text-sm text-gray-500 mt-2">Please wait</p>
                </div>
            </div>
        )
    }

  return post ? (
    <div className='py-8 sm:py-12 min-h-[calc(100vh-200px)] bg-gradient-to-b from-gray-50 to-white'>
        <Container>
            {/* Hero Section - Responsive */}
            <div className="mb-8 sm:mb-10 text-center animate-fadeInDown">
                {/* Icon with animation */}
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 relative group">
                    <div className="absolute inset-0 bg-green-200 rounded-full opacity-0 group-hover:opacity-50 animate-ping"></div>
                    <svg className="relative w-7 h-7 sm:w-8 sm:h-8 text-green-600 transform transition-transform group-hover:rotate-12 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight animate-fadeIn">
                    Edit Post
                </h1>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fadeIn animation-delay-200">
                    Update your post content, images, and settings
                </p>

                {/* Decorative underline */}
                <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full animate-expand"></div>
            </div>

            {/* Form Container - Responsive */}
            <div className="max-w-6xl mx-auto animate-fadeInUp animation-delay-400">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 transition-all duration-300 hover:shadow-xl">
                    <PostForm post={post} />
                </div>
            </div>
        </Container>

        {/* CSS Animations */}
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
                to { width: 5rem; }
            }

            @keyframes bounce-slow {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
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
            .animation-delay-600 { animation-delay: 0.6s; }
            .animation-delay-800 { animation-delay: 0.8s; }
            .animation-delay-1000 { animation-delay: 1s; }
            .animation-delay-1200 { animation-delay: 1.2s; }
        `}</style>
    </div>
  ) : null
}

export default EditPost
