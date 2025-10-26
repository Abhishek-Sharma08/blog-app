import React, { useState, useEffect } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false)
  const [ isScrolled, setIsScrolled ] = useState(false)

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "My Posts",
      slug: "/my-posts",
      active: authStatus, 
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  const handleNavigate = (slug) => {
    navigate(slug)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-opacity-95 transition-all duration-300 ${isScrolled ? 'shadow-lg py-2' : 'shadow-sm py-3 md:py-4'
      }`}>
      <Container>
        <nav className='flex items-center justify-between'>
          {/* Logo with animation */}
          <div className='flex-shrink-0 transform transition-transform duration-300 hover:scale-105'>
            <Link to='/' className='flex items-center group'>
              <div className='transition-opacity duration-200 group-hover:opacity-80'>
                <Logo width='60px' className='md:w-[70px]' />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation with staggered animation */}
          <ul className='hidden md:flex items-center gap-2'>
            {navItems.map((item, index) =>
              item.active ? (
                <li
                  key={item.name}
                  className='animate-fadeIn'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`relative px-4 lg:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 ${location.pathname === item.slug
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    {item.name}
                    {/* Active indicator animation */}
                    {location.pathname === item.slug && (
                      <span className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse'></span>
                    )}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className='animate-fadeIn' style={{ animationDelay: `${navItems.filter(i => i.active).length * 0.1}s` }}>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile Hamburger Button with animation */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95'
            aria-label='Toggle menu'
          >
            <svg
              className='w-6 h-6 transition-transform duration-300'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              {isMobileMenuOpen ? (
                <path d='M6 18L18 6M6 6l12 12' className='animate-fadeIn' />
              ) : (
                <path d='M4 6h16M4 12h16M4 18h16' className='animate-fadeIn' />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu with slide animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <ul className='py-4 space-y-2 border-t border-gray-100'>
            {navItems.map((item, index) =>
              item.active ? (
                <li
                  key={item.name}
                  className={`transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${index * 0.05}s` : '0s' }}
                >
                  <button
                    onClick={() => handleNavigate(item.slug)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 transform hover:translate-x-1 ${location.pathname === item.slug
                      ? 'bg-gray-900 text-white shadow-sm scale-[1.02]'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li
                className={`pt-2 border-t border-gray-100 transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${navItems.filter(i => i.active).length * 0.05}s` : '0s' }}
              >
                <LogoutBtn className='w-full' />
              </li>
            )}
          </ul>
        </div>
      </Container>

      {/* Add keyframes for animations */}
      <style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }
`}</style>

    </header>
  )
}

export default Header

