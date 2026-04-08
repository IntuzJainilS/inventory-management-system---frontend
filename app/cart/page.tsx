"use client"
import React from 'react'
import { useCart } from '@/app/context/CartContext'
import Link from 'next/link';
import { getSessionData } from '@/lib/auth';
import api from '@/lib/axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const Cart = () => {
    const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

    //calculate total price
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <Link href="/productlist" className="text-blue-600 underline">Go back to products</Link>
                </div>
                <ToastContainer />
                <Footer />
            </>
        );
    }

    const handleUpdate = (id: string, value: any, maxAvailable: any) => {
        const newQuantity = parseInt(value);

        // Prevent negative numbers or text; ensure it doesn't exceed stock
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            if (newQuantity <= maxAvailable) {
                updateQuantity(id, newQuantity);
            } else {
                updateQuantity(id, maxAvailable); // if quantity enters more than the available quantity then changes it to maximum quantity
                console.log("max quenty reached")
            }
        }
    };

    const handleCreateOrder = async () => {
        try {
            const session = await getSessionData();
            const token = session?.token;
            if (!session || !token) {
                console.log("token not found")
                return
            }
            const items = {
                items: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                }))
            };
            const res = await api.post('/create-order', items, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("order created successfully", res.data)
            // clearCart();
            toast.success('order created successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "colored",
                transition: Bounce,
            })
            setTimeout(() => {
                clearCart();
            }, 2000);

        } catch (error) {
            console.log("failed to create order", error)
            toast.error("failed to create order", {
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
            <div className="min-h-screen mx-auto p-6">
                <div className='flex m-2.5 justify-center'>
                    <h1 className='font-bold text-3xl text-gray-800 mt-1.5'>Cart page</h1>
                </div>
                <div className="space-y-4">
                    {cart.map((item) => {
                        const available = item.stock_quantity - item.reserved_quantity;

                        return (
                            <div key={item.id} className="flex border-b pb-4 gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-gray-600">Rs.{item.price} each</p>
                                    {/* <p className="text-xs text-red-500">Only {available} left in stock</p> */}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 hover:bg-gray-100"
                                        >-</button>
                                        <input
                                            className="w-10 text-center border-none outline-none focus:ring-0 bg-transparent"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdate(item.id, e.target.value, available)}
                                        />
                                        <button
                                            onClick={() => {
                                                if (item.quantity < available) {
                                                    updateQuantity(item.id, item.quantity + 1);
                                                }
                                            }}
                                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-30"
                                            disabled={item.quantity >= available}
                                        >+</button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 p-6 bg-gray-200 rounded-xl">
                    <div className="flex justify-between text-xl font-medium">
                        <span>Total:</span>
                        <span>Rs.{total.toFixed(2)}</span>
                    </div>
                    <button onClick={() => handleCreateOrder()} className="w-full mt-6 active:scale-95 active:bg-gray-700 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        Create Order
                    </button>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </>
    )
}

export default Cart
