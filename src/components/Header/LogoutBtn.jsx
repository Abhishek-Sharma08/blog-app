import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'



function LogoutBtn() {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    
    const logoutHandler = () => {
        setIsLoading(true)
        authService.logout().then(() => {
            dispatch(logout())
        }).finally(() => {
            setIsLoading(false)
        })
    }
    
  return (
    <button
    className='group relative w-full md:w-auto px-6 py-3 md:py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg md:rounded-full transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 overflow-hidden'
    onClick={logoutHandler}
    disabled={isLoading}
    >
      {/* Animated background gradient */}
      <span className='absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
      
      {/* Ripple effect on hover */}
      <span className='absolute inset-0 rounded-lg md:rounded-full opacity-0 group-hover:opacity-20 bg-white animate-ping'></span>
      
      {/* Button content */}
      <span className='relative flex items-center justify-center gap-2'>
        {isLoading ? (
          <>
            <svg className='animate-spin h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
            </svg>
            <span className='animate-pulse'>Logging out...</span>
          </>
        ) : (
          <>
            <svg 
              className='w-4 h-4 transition-transform duration-300 group-hover:rotate-12' 
              fill='none' 
              stroke='currentColor' 
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            <span>Logout</span>
          </>
        )}
      </span>
    </button>
  )
}



export default LogoutBtn

