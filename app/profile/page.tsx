"use client"
import { getSessionData } from '@/lib/auth';
import api from '@/lib/axios';
import React, { useEffect, useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';


const Profile = () => {
    const [history, sethistory] = useState<any>([])
    const [user, setUser] = useState<{ full_name: string, email: string } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getSessionData();
                console.log("session:", session)
                setUser({ full_name: session.full_name ?? "", email: session.email ?? "" })

                const token = session?.token;
                if (!session || !token) {
                    console.log("token not found")
                    toast.error('please login to see profile', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        theme: "light",
                        transition: Bounce,
                    })
                    return
                }
                const res = await api.get('/order-history', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                sethistory(res.data.data)
                console.log("user history fetched successfully", res)
            } catch (error) {
                console.log("failed to fetch User History", error)
                toast.error('failed to fetch User History', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    theme: "light",
                    transition: Bounce,
                })

            }
        }
        fetchData();
    }, [])

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col items-center mb-12'>
                    <h1 className='text-4xl font-extrabold text-gray-900 tracking-tight'>
                        User Profile
                    </h1>
                </div>
                {user && (
                    <div className="mt-4 mb-3 p-4  rounded-lg text-left w-full max-w-2xl">
                        <p className="text-lg font-semibold text-gray-800">Name:{user.full_name}</p>
                        <p className="text-gray-500">Email:{user.email}</p>
                    </div>
                )}
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="p-3 text-center">Product</th>
                            <th className="p-3 text-center">Quentity</th>
                            <th className="p-3 text-center">Price (at Purchase)</th>
                            <th className="p-3 text-center">Total Order Amount</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history?.map((order: any) => (
                            <tr key={order.id} className='border-b hover:bg-gray-50'>
                                <td className="p-3 font-medium">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className='text-center'>{item.product?.name}</div>
                                    ))}
                                </td>

                                <td className="p-3">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className='text-center'>{item.quantity}</div>
                                    ))}
                                </td>

                                <td className="p-3">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className='text-center'>₹{item.price_at_purchase}</div>
                                    ))}
                                </td>

                                <td className="p-3 text-center">₹{order.total_amount}</td>

                                <td className="p-3 text-center">
                                    <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                        {order.status}
                                    </span>
                                </td>

                                <td className="p-3 text-sm text-center">
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
            <Footer />
        </>

    )
}

export default Profile
