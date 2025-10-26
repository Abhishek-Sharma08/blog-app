import React, {useId} from 'react'



const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    className = '',
    ...props
}, ref) {
    const id = useId();
    return (
        <div className='w-full'>
            {label && (
                <label 
                    className='text-xs sm:text-sm font-medium text-gray-700 block mb-2' 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input 
                type={type} 
                id={id} 
                ref={ref} 
                className={`block w-full rounded-lg border border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`} 
                {...props} 
            />
        </div>
    )
})



export default Input
