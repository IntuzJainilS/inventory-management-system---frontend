"use client"
import { getSessionData } from '@/lib/auth'
import api from '@/lib/axios'
import React, { useEffect, useState } from 'react'
import { useCart } from '@/app/context/CartContext'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Footer from '@/app/components/footer'
import Navbar from '@/app/components/Navbar'


const GetProduct = () => {

    const [product, setproduct] = useState<any>([])
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getSessionData();
                const token = session?.token;
                // console.log("token:", token)
                if (!session || !token) {
                    console.log("token not found")
                    toast.error('please login to add product to cart', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        theme: "light",
                        transition: Bounce,
                    })
                    return
                }

                const res = await api.get('/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setproduct(res.data);
                console.log("products fetched successfully", res)
            } catch (error) {
                console.log("failed to fetch product", error)
                toast.error('failed to fetch products', {
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

    const handleAddToCart = async (product: any) => {
        const session = await getSessionData();
        const token = session?.token;
        if (!token) {
            console.log("please login to create order")
        }
        const available = product.stock_quantity - product.reserved_quantity;

        if (available > 0) {
            addToCart(product); // Pass the whole object
            toast.success('Product added to cart', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "colored",
                transition: Bounce,
            })
        } else {
            alert("Out of stock!");
            toast.error('failed to add products to cart', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "light",
                transition: Bounce,
            })
        }
    };

    return (
    <>
    <Navbar/>
        <div className='min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col items-center mb-12'>
                    <h1 className='text-4xl font-extrabold text-gray-900 tracking-tight'>
                        Product List
                    </h1>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {product?.data?.map((product: any) => {
                        const availableStock = product.stock_quantity - product.reserved_quantity;
                        const isOutOfStock = availableStock <= 0;

                        return (
                            <div
                                key={product.id}
                                className='group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between'
                            >
                                <div>
                                    <div className='flex justify-between items-start mb-4'>
                                        <h3 className='text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1'>
                                            {product.name}
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {isOutOfStock ? 'Sold Out' : 'In Stock'}
                                        </span>
                                    </div>

                                    <div className='space-y-1 mb-6'>
                                        <p className='text-2xl font-black text-gray-700'>
                                            {product.price}
                                        </p>
                                        <div className='text-sm text-gray-500 flex flex-col gap-1 pt-2 border-t border-gray-50'>
                                            <div className='flex justify-between'>
                                                <span>Total Stock:</span>
                                                <span className='font-medium text-gray-700'>{product.stock_quantity}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span>Reserved:</span>
                                                <span className='font-medium text-gray-700'>{product.reserved_quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={isOutOfStock}
                                    className='w-full py-3 px-4 rounded-xl font-bold text-white transition-all transform active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 bg-gray-900 shadow-md hover:shadow-indigo-200'
                                >
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <ToastContainer />
        </div>
        <Footer/>
    </>
        
    );
}

export default GetProduct
