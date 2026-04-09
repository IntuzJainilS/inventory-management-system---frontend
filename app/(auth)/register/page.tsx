"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Footer from '@/app/components/footer';
import Navbar from '@/app/components/Navbar';


export default function SignupPage() {
    const [full_name, setfull_name] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');

    const router = useRouter();
    const [error, seterror] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log("Registering:", full_name, email,);
        try {
            const response = await api.post('/register', {
                full_name,
                email,
                password,
            })
            console.log('User Registered successful:', response);
            // window.location.href = "/login";
            router.push('/login')

        } catch (error) {
            console.error("Signup error:", error);
            seterror('Signup error')
        }
    };

    return (
        <>
        <Navbar/>
            <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-500">Libraries change lives for the better.</p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full-Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="John Doe"
                                onChange={(e) => setfull_name(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="name@company.com"
                                onChange={(e) => setemail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="••••••••"
                                onChange={(e) => setpassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
            <Footer/>
        </>
    );
}