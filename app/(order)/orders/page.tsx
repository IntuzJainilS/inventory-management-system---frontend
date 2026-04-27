"use client"
import Footer from '@/app/components/footer'
import Navbar from '@/app/components/Navbar'
import Pagination from '@/app/components/Pagination'
import SearchBar from '@/app/components/Searchbar'
import SortingAndFiltering from '@/app/components/Sorting'
import { getSessionData } from '@/lib/auth'
import api from '@/lib/axios'
import { checkAdmin } from '@/lib/checkadmin'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';

const Orders = () => {
    const router = useRouter();
    // useEffect(() => {
    //     checkAdmin(router)
    // }, [])

    const [orders, setorders] = useState<any>([])

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || "";
    const currentPage = Number(searchParams.get('page')) || 1;
    const sort_by = searchParams.get('sort_by') || 'createdAt';
    const order = searchParams.get('order') || 'DESC';
    const status = searchParams.get('status') || ""

    const sortOptions = [
        { label: "Pending", value: "pending" },
        { label: "Placed", value: "placed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Date Created", value: "createdAt" },
    ];

    const fetchedOrders = useCallback(async () => {
        try {
            const session = await getSessionData();
            const token = session?.token;
            const res = await api.get('/orders', {
                params: { search: searchQuery, page: currentPage, sort_by: sort_by, status: status, order: order },
                headers: { Authorization: `Bearer ${token}` }
            })
            setorders(res.data)
            console.log(res.data)
        } catch (error) {
            console.log("failed to fetch orders", error)
        }
    }, [searchQuery, currentPage, sort_by, status, order]);

    useEffect(() => {
        // const fetchedOrders = async () => {
        //     try {
        //         const session = await getSessionData();
        //         const token = session?.token;
        //         // if (!session || !token) {
        //         //     console.log("token not found")
        //         //     return
        //         // }
        //         const res = await api.get('/orders', {
        //             params: { search: searchQuery, page: currentPage, sort_by: sort_by, status: status, order: order, },
        //             headers: {
        //                 Authorization: `Bearer ${token}`
        //             }
        //         })
        //         setorders(res.data)
        //         console.log("order fetched successfully", res.data)
        //     } catch (error) {
        //         console.log("failed to fetch orders", error)
        //         toast.error('failed to fetch orders', {
        //             position: "top-right",
        //             autoClose: 2000,
        //             hideProgressBar: false,
        //             theme: "light",
        //             transition: Bounce,
        //         })
        //     }
        // }
        checkAdmin(router)
        fetchedOrders();
    }, [fetchedOrders, router])

    const handlePlaceOrder = async (id: string) => {
        try {
            const session = await getSessionData();
            const token = session?.token;
            // console.log("token:", token)
            const orderToPlace = orders?.data?.rows?.find((o: any) => o.id === id);

            const items = orderToPlace?.order_items.map((item: any) => ({
                id: item.product?.id,
                quantity: item.quantity,
                price: item.price_at_purchase
            }));
            // console.log("Items:", items)
            const res = await api.put(`/place-order/${id}`, { items }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("order placed successfully", res)
            toast.success('order placed successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "colored",
                transition: Bounce,
            })
            fetchedOrders();
        } catch (error: any) {
            console.log("failed to placed order", error)
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "light",
                transition: Bounce,
            })
        }
    }

    const handleCancelOrder = async (id: string) => {
        try {
            const session = await getSessionData();
            const token = session?.token;
            const orderToPlace = orders?.data?.rows?.find((o: any) => o.id === id);

            const items = orderToPlace?.order_items.map((item: any) => ({
                id: item.product?.id,
                quantity: item.quantity,
                price: item.price_at_purchase
            }));
            console.log("Items:", items)
            const res = await api.put(`/order-cancel/${id}`, { items }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("order cancelled successfully", res)
            toast.success('order cancelled successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "colored",
                transition: Bounce,
            })
            fetchedOrders();
        } catch (error: any) {
            console.log("failed to cancel order", error)
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "light",
                transition: Bounce,
            })
        }
    }

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-linear-to-br from-slate-100 to-blue-200 overflow-hidden'>
                <div className='flex justify-center'>
                    <h1 className='font-bold text-3xl text-gray-800 mt-1.5'>Orders</h1>
                </div>
                <SearchBar />
                <SortingAndFiltering sortOptions={sortOptions} />
                <div className='m-2.5'>
                    <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr className='p-4 bg-blue-200'>
                                <th className="p-3 text-center">full_name</th>
                                <th className="p-3 text-center">Email</th>
                                <th className="p-3 text-center">Product</th>
                                <th className="p-3 text-center">Quantity</th>
                                <th className="p-3 text-center">Price (at Purchase)</th>
                                <th className="p-3 text-center">Total Order Amount</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Date</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.data?.rows?.map((order: any) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-center">{order.user?.full_name}</td>
                                    <td className="p-3 text-center">{order.user?.email}</td>

                                    <td className="p-3 font-medium">
                                        {order.order_items?.map((item: any, i: any) => (
                                            <div className='p-3 text-center' key={item.id || i}>{item.product?.name}</div>
                                        ))}
                                    </td>

                                    <td className="p-3">
                                        {order.order_items?.map((item: any, i: any) => (
                                            <div className='p-3 text-center' key={item.id || i}>{item.quantity}</div>
                                        ))}
                                    </td>

                                    <td className="p-3">
                                        {order.order_items?.map((item: any, i: any) => (
                                            <div className='p-3 text-center' key={item.id || i}>{item.price_at_purchase}</div>
                                        ))}
                                    </td>

                                    <td className="p-3 text-center">{order.total_amount}</td>
                                    <td className="p-3 text-center">
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-center">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB')
                                        : 'N/A'}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handlePlaceOrder(order.id)}
                                                disabled={order.status === 'placed' || order.status === 'cancelled' || order.status === 'failed'}
                                                className={`px-2 py-1 rounded active:scale-95 active:bg-blue-300 text-white text-sm transition ${(order.status === 'placed' || order.status === 'cancelled' || order.status === 'failed')
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                            >
                                                Place Order
                                            </button>

                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={order.status === 'cancelled' || order.status === 'failed'}
                                                className={`px-2 py-1 rounded active:scale-95 active:bg-red-300 text-white text-sm transition ${order.status === 'cancelled' || order.status === 'failed'
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-red-600 hover:bg-red-700'
                                                    }`}
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination totalPages={orders?.pagination?.totalPages || 1} />
                <ToastContainer />
            </div>
            <Footer />
        </>

    )
}

export default Orders
