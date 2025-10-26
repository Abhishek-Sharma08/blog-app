import React from 'react'
import { Container, PostForm } from '../components'



function AddPost() {
  return (
    <div className='py-8 sm:py-12 min-h-[calc(100vh-200px)] bg-gradient-to-b from-gray-50 to-white'>
        <Container>
            {/* Hero Section - Responsive */}
            <div className="mb-8 sm:mb-10 text-center animate-fadeInDown">
                {/* Icon with pulse background */}
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 relative group">
                    <div className="absolute inset-0 bg-blue-200 rounded-full opacity-0 group-hover:opacity-50 animate-ping"></div>
                    <svg className="relative w-7 h-7 sm:w-8 sm:h-8 text-blue-600 transform transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight animate-fadeIn">
                    Create New Post
                </h1>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fadeIn animation-delay-200">
                    Share your ideas, stories, and thoughts with readers around the world
                </p>

                {/* Decorative underline */}
                <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-expand"></div>
            </div>

            {/* Form Container - Responsive */}
            <div className="max-w-6xl mx-auto animate-fadeInUp animation-delay-400">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 transition-all duration-300 hover:shadow-xl">
                    <PostForm />
                </div>
            </div>

            {/* Tips Section - Responsive */}
            <div className="mt-6 sm:mt-8 max-w-6xl mx-auto animate-fadeIn animation-delay-600">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg sm:rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5 animate-bounce-slow" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Writing Tips</h3>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                Choose an engaging title, add a high-quality featured image, and format your content with headings and paragraphs for better readability.
                            </p>
                        </div>
                    </div>
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
  )
}

export default AddPost
