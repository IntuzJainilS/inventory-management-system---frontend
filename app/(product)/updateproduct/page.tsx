"use client"
import Navbar from '@/app/components/Navbar';
import Pagination from '@/app/components/Pagination';
import SearchBar from '@/app/components/Searchbar';
import UpdateProductModal from '@/app/components/UpdateProduct';
import { getSessionData } from '@/lib/auth';
import api from '@/lib/axios';
import { checkAdmin } from '@/lib/checkadmin';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';


const UpdateProduct = () => {
    const router = useRouter();
    useEffect(() => {
        checkAdmin(router);
    }, [])
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || "";
    const currentPage = Number(searchParams.get('page')) || 1;
    const [product, setproduct] = useState<any>([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)

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
                params: { search: searchQuery, page: currentPage, },
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
    useEffect(() => {
        fetchData();
    }, [searchQuery, currentPage,])

    const handleUpdate = async (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true)
    }
    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
    }
    const handleUpdateSuccess = () => {
        fetchData()
    }
    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-linear-to-br from-slate-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col items-center mb-12'>
                    <h1 className='text-4xl font-extrabold text-gray-900 tracking-tight'>
                        Products List
                    </h1>
                </div>
                <SearchBar />
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className='bg-amber-200'>
                        <tr>
                            <th className="p-3 text-center">Name</th>
                            <th className="p-3 text-center">Price</th>
                            <th className="p-3 text-center">Stock-Quantity</th>
                            <th className="p-3 text-center">Reserved-Quantity</th>
                            <th className="p-3 text-center">Available-Quantity</th>
                            <th className="p-3 text-center">Added on</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product?.data?.map((product: any) => {
                            const availableStock = product.stock_quantity - product.reserved_quantity;
                            return (
                                <tr key={product.id} className='border-b hover:bg-gray-50'>
                                    <td className='p-3 text-center'>{product.name}</td>
                                    <td className='p-3 text-center'>{product.price}</td>
                                    <td className='p-3 text-center'>{product.stock_quantity}</td>
                                    <td className='p-3 text-center'>{product.reserved_quantity}</td>
                                    <td className='p-3 text-center'>{availableStock}</td>
                                    <td className='p-3 text-center'>{product.createdAt}</td>
                                    <td className='p-3 text-center'>
                                        <button onClick={() => handleUpdate(product)} className='px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700 transition-colors'>Update</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <UpdateProductModal
                    isOpen={isModalOpen}
                    product={selectedProduct}
                    onClose={handleModalClose}
                    onSuccess={handleUpdateSuccess}
                />
                <Pagination totalPages={product?.pagination?.totalPages || 1} />
            </div>

        </>
    )
}

export default UpdateProduct