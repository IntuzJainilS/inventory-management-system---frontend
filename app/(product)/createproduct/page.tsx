"use client"
import Footer from '@/app/components/footer'
import Navbar from '@/app/components/Navbar'
import { getSessionData } from '@/lib/auth'
import api from '@/lib/axios'
import { checkAdmin } from '@/lib/checkadmin'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';

const CreateProduct = () => {
    const router = useRouter();
    useEffect(() => {
        checkAdmin(router);
    }, [])

    const handleFormSubmit = async (formData: FormData) => {
        const data = {
            name: formData.get('name'),
            price: formData.get('price'),
            stock_quantity: formData.get('stock'),
            reserved_quantity: formData.get('reserved') || 0,
        }
        console.log(data)
        try {
            const session = await getSessionData();
            const token = session?.token;
            const res = api.post('/product', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("product created successfully", (await res).data)
            toast.success('product created successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "colored",
                transition: Bounce,
            })
        } catch (error) {
            console.log("failed to create product", error)
            toast.error('failed to create product', {
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
    <Navbar/>
        <div className="min-h-screen bg-linear-to-br from-slate-100 to-blue-200 py-10">
            <div className='flex justify-center'>
                <h1 className='font-bold text-3xl text-gray-800'>Add Product</h1>
            </div>

            <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                <form action={handleFormSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                        <input
                            name="name"
                            type='text'
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Wireless Headphones"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                        <input
                            name="price"
                            type='number'
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                            <input
                                name="stock"
                                type='number'
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Reserved (optional)</label>
                            <input
                                name="reserved"
                                type='number'
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
                    >
                        Create Product
                    </button>
                </form>
            </div>
            <ToastContainer/>
        </div>
        <Footer/>
    </>
        
    )
}

export default CreateProduct
