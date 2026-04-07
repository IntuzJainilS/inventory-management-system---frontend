"use client"
import { createContext, useContext, useState, ReactNode } from "react"

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number; // How many are in the cart
    stock_quantity: number;
    reserved_quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
    cartCount: number;
    clearCart: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: any) => {
        const available = product.stock_quantity - (product.reserved_quantity || 0);
        console.log("available:", available);

        if (available <= 0) {
            -
            alert("This item is out of stock!");
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);

            if (existingItem) {
                // Check if adding one more exceeds available stock
                if (existingItem.quantity >= available) {
                    alert("Cannot add more. Limit reached based on available stock.");
                    return prevCart;
                }
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            return [...prevCart, {
                ...product,
                quantity: 1,
                reserved_quantity: product.reserved_quantity || 0
            }];
        });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === id) {
                    const available = item.stock_quantity - item.reserved_quantity;
                    return { ...item, quantity: Math.min(quantity, available) };
                }
                return item;
            })
        );
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};