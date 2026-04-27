"use client";

import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import api from '@/lib/axios';
import { createSession } from '@/lib/auth';
import Footer from '@/app/components/footer';
import { Bounce, ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log("Logging in with:", { email, password });
        try {
            console.log("request incoming")
            const res = await api.post('/login', {
                email,
                password
            })
            console.log('Login successful:', res);

            // const token = res.data.token;
            // const usertype = res.data.usertype
            // const email = res.data.email
            // const full_name = res.data.name
            const { token, usertype, full_name } = res.data;
            // console.log("token-",token)
            // console.log("usertype-",usertype)

            // after successfull login create session 
            await createSession(token, usertype, full_name, email);
            console.log("Session created")
            // window.location.href = "/";
            router.push('/')
        } catch (error: any) {
            // console.error(error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "light",
                transition: Bounce,
            })
        }
    };

    return (
        <div className='flex flex-col h-screen overflow-hidden'>
            <Navbar />
            <div className="grow flex items-center justify-center bg-gray-300 px-4">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
                        <p className="mt-2 text-sm text-gray-500">Please enter your details</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-600">
                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-2">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                        </div> */}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
}