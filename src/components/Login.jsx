import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from "./index"
import { useDispatch } from "react-redux"
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"



function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [ error, setError ] = useState("")
    const [ isLoading, setIsLoading ] = useState(false)



    const login = async (data) => {
        setError("")
        setIsLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div className='flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 sm:py-12 px-4'>
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className='relative mx-auto w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 animate-fadeInUp'>
                {/* Logo with animation */}
                <div className="mb-6 flex justify-center animate-bounceIn">
                    <span className="inline-block w-full max-w-[100px] transform transition-transform duration-300 hover:scale-110">
                        <Logo width="100%" />
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-center text-2xl sm:text-3xl font-bold leading-tight text-gray-900 animate-fadeIn">
                    Sign in to your account
                </h2>

                {/* Subtitle */}
                <p className="mt-2 text-center text-sm text-gray-600 animate-fadeIn animation-delay-200">
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline inline-flex items-center group"
                    >
                        Sign Up
                        <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </p>

                {/* Error message with animation */}
                {error && (
                    <div className="mt-6 animate-shake">
                        <div className="text-red-600 text-center text-sm bg-red-50 border border-red-200 rounded-lg py-3 px-4 flex items-start gap-2">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(login)} className='mt-8 animate-fadeIn animation-delay-400'>
                    <div className='space-y-5'>
                        {/* Email Input */}
                        <div className="transform transition-all duration-300 hover:translate-x-1">
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    validate: {
                                        matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 animate-shake">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="transform transition-all duration-300 hover:translate-x-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 animate-shake">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full group relative overflow-hidden"
                            disabled={isLoading}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </Button>
                    </div>
                </form>

                {/* Divider */}
                <div className="mt-6 animate-fadeIn animation-delay-600">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Secure login</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS animations */}
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
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
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
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out;
    }
    .animate-fadeIn {
        animation: fadeIn 0.8s ease-out;
    }
    .animate-bounceIn {
        animation: bounceIn 0.8s ease-out;
    }
    .animate-shake {
        animation: shake 0.3s ease-in-out;
    }
    .animate-blob {
        animation: blob 7s infinite;
    }
    .animation-delay-200 { animation-delay: 0.2s; }
    .animation-delay-400 { animation-delay: 0.4s; }
    .animation-delay-600 { animation-delay: 0.6s; }
    .animation-delay-2000 { animation-delay: 2s; }
`}</style>

        </div>
    )
}



export default Login
