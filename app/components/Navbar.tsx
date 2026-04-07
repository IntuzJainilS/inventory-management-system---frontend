"use client"
import { DeleteSession, getSessionData } from '@/lib/auth';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const { cartCount } = useCart();
    const checkAdmin = async () => {
        const hascookie: any = await getSessionData();
        console.log("cookies", hascookie)
        if (!hascookie) {
            console.log("session not present")
        } else {
            setRole(hascookie.role)
            console.log(role)
            const usertype = hascookie.role;
            console.log("usertype", usertype);
        }
    }
    useEffect(() => {
        checkAdmin();
    }, [])

    const handleLogout = async () => {
        await DeleteSession();
        router.push('/login')
        router.refresh();
    }

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
            {/* Logo Section */}
            <div className="text-2xl font-extrabold tracking-tight text-blue-600 hover:opacity-90 transition-opacity">
                <Link href="/">Home</Link>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6 text-sm font-semibold text-gray-600">
                    {role === "admin" && (
                        <>
                            <Link href="/createproduct" className="hover:text-blue-600 transition-colors">Create Product</Link>
                            <Link href="/orders" className="hover:text-blue-600 transition-colors">Orders</Link>
                        </>
                    )}

                    {role ? (
                        <>
                            <Link href="/productlist" className="hover:text-blue-600 transition-colors">Products</Link>
                            <Link href="/cart" className="relative hover:text-blue-600 transition-colors inline-block p-1">
                                <FaShoppingCart size={25} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-in fade-in zoom-in duration-200">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/profile" className='hover:text-blue-600 transition-colors'>Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="ml-2 px-5 py-2 text-white bg-red-500 rounded-full font-medium hover:bg-red-600 shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar
