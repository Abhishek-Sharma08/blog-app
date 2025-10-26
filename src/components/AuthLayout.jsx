import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'



export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const [fadeIn, setFadeIn] = useState(false)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        // Authentication logic
        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
        
        // Smooth transition after auth check
        setTimeout(() => {
            setLoader(false)
            setTimeout(() => setFadeIn(true), 50)
        }, 500)
    }, [authStatus, navigate, authentication])

  return loader ? (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 animate-gradient">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative text-center animate-fadeInScale">
        {/* Spinning loader with gradient */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-blue-400 opacity-20"></div>
          <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-blue-500 border-r-purple-500 shadow-lg"></div>
          
          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading text with typing animation */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-800 animate-pulse">
            <span className="inline-block animate-bounce animation-delay-0">L</span>
            <span className="inline-block animate-bounce animation-delay-100">o</span>
            <span className="inline-block animate-bounce animation-delay-200">a</span>
            <span className="inline-block animate-bounce animation-delay-300">d</span>
            <span className="inline-block animate-bounce animation-delay-400">i</span>
            <span className="inline-block animate-bounce animation-delay-500">n</span>
            <span className="inline-block animate-bounce animation-delay-600">g</span>
            <span className="inline-block animate-bounce animation-delay-700">.</span>
            <span className="inline-block animate-bounce animation-delay-800">.</span>
            <span className="inline-block animate-bounce animation-delay-900">.</span>
          </h1>
          <p className="text-sm text-gray-600 animate-fadeIn animation-delay-500">
            {authentication ? 'Verifying authentication' : 'Preparing your experience'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress rounded-full"></div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-0"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  ) : (
    <div className={`transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  )

  // Add CSS for custom animations
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes blob {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(20px, -50px) scale(1.1);
        }
        50% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        75% {
          transform: translate(50px, 50px) scale(1.05);
        }
      }
      @keyframes progress {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      @keyframes gradient {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
      .animate-fadeInScale {
        animation: fadeInScale 0.6s ease-out;
      }
      .animate-blob {
        animation: blob 7s infinite;
      }
      .animate-progress {
        animation: progress 1.5s ease-in-out infinite;
      }
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient 3s ease infinite;
      }
      .animation-delay-0 { animation-delay: 0s; }
      .animation-delay-100 { animation-delay: 0.1s; }
      .animation-delay-200 { animation-delay: 0.2s; }
      .animation-delay-300 { animation-delay: 0.3s; }
      .animation-delay-400 { animation-delay: 0.4s; }
      .animation-delay-500 { animation-delay: 0.5s; }
      .animation-delay-600 { animation-delay: 0.6s; }
      .animation-delay-700 { animation-delay: 0.7s; }
      .animation-delay-800 { animation-delay: 0.8s; }
      .animation-delay-900 { animation-delay: 0.9s; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
    `;
    if (!document.querySelector('#protected-animations')) {
      style.id = 'protected-animations';
      document.head.appendChild(style);
    }
  }
}
