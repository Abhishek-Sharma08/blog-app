import React from 'react'

function Logo({width = '120px'}) {
  return (
    <div style={{width}} className='flex items-center gap-2 sm:gap-3 group cursor-pointer'>
      {/* Book/Blog Icon with animation */}
      <svg 
        viewBox="0 0 50 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        
        {/* Book Shape with shadow */}
        <rect x="10" y="8" width="30" height="34" rx="2" fill="url(#logoGradient)" className="transition-all duration-300" />
        
        {/* Book spine shadow */}
        <rect x="10" y="8" width="3" height="34" rx="1" fill="black" opacity="0.15" />
        
        {/* Lines representing text with staggered animation */}
        <rect x="15" y="15" width="8" height="2" rx="1" fill="white" opacity="0.9" className="animate-fadeIn" />
        <rect x="15" y="20" width="20" height="2" rx="1" fill="white" opacity="0.9" className="animate-fadeIn animation-delay-100" />
        <rect x="15" y="25" width="20" height="2" rx="1" fill="white" opacity="0.9" className="animate-fadeIn animation-delay-200" />
        <rect x="15" y="30" width="15" height="2" rx="1" fill="white" opacity="0.9" className="animate-fadeIn animation-delay-300" />
      </svg>
      
      {/* BlogApp Text with gradient animation */}
      <span className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-600'>
        Blogs
      </span>

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-5px);
          }
          to {
            opacity: 0.9;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  )
}

export default Logo
