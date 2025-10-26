import React from 'react'


function Button({
    children,
    type = 'button',
    bgColor = 'bg-blue-500',
    textColor = 'text-white',
    className = '',
    ...props
}) {
    return (
        <button 
            type={type}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ease-in-out hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}


export default Button
