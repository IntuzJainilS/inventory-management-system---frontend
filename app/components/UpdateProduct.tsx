"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { getSessionData } from '@/lib/auth';
import api from '@/lib/axios';

interface Product {
    id: string;
    name?: string;
    price?: number;
    stock_quantity?: number;
    reserved_quantity?: number;
}

interface UpdateProductModalProps {
    isOpen: boolean
    product: Product | null
    onClose: () => void
    onSuccess: () => void
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({ isOpen, product, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<{
        name?: string
        price?: number
        stock_quantity?: number
        reserved_quantity?: number
    }>({
        name: '',
        price: 0,
        stock_quantity: 0,
        reserved_quantity: 0,
    })


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                stock_quantity: product.stock_quantity,
                reserved_quantity: product.reserved_quantity,
            })
            setError('')
        }
    }, [product, isOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        const numericFields = ['price', 'stock_quantity', 'reserved_quantity'];
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? (parseFloat(value) || 0) : value
        }));
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!product) return

        setLoading(true)
        setError('')

        try {
            const session = await getSessionData()
            const token = session?.token

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name || "");
            formDataToSend.append('price', String(formData.price || 0));
            formDataToSend.append('stock_quantity', String(formData.stock_quantity || 0));
            formDataToSend.append('reserved_quantity', String(formData.reserved_quantity || 0));

            console.log("product_id", product.id)
            const response = await api.put(`/update-product/${product.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("Product updated successfully", response)
            onSuccess()
            onClose()
        } catch (err: any) {
            console.log("Error updating book", err)
            setError(err.response?.data?.message || 'Failed to update product. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Update Product</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock-quantity
                        </label>
                        <input
                            type='number'
                            name="stock_quantity"
                            value={formData.stock_quantity ?? ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reserved-Quantity
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.reserved_quantity}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                        />
                    </div>


                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProductModal
