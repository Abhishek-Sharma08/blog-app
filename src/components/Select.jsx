import React, {useId} from 'react'



function Select({
    options,
    label,
    className = '',
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && (
            <label 
                htmlFor={id} 
                className='text-xs sm:text-sm font-medium text-gray-700 block mb-2'
            >
                {label}
            </label>
        )}
        <div className='relative'>
            <select
                {...props}
                id={id}
                ref={ref}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white text-gray-900 text-sm outline-none border border-gray-300 w-full transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none cursor-pointer pr-10 ${className}`}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                }}
            >
                {options?.map((option) => (
                    <option key={option} value={option} className='py-2'>
                        {option}
                    </option>
                ))}
            </select>
            
            {/* Custom dropdown arrow (alternative approach) */}
            <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <svg 
                    className='w-5 h-5 text-gray-400 transition-transform duration-200' 
                    fill='none' 
                    stroke='currentColor' 
                    viewBox='0 0 24 24'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
            </div>
        </div>
    </div>
  )
}



export default React.forwardRef(Select)
