import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    getCart,
    addToCart as addToCartService,
    updateCartItem as updateCartItemService,
    removeFromCart as removeFromCartService,
    clearCartBackend
} from '../services/cartService';
import { useAuth } from './AuthContext.jsx'; // *** CRITICAL FIX: Added .jsx extension

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch cart from backend when user is authenticated
    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setLoading(false);
                setCart(null); // Clear cart if user logs out
                return;
            }

            try {
                setLoading(true);
                const userCart = await getCart(); // No longer needs userId
                setCart(userCart);
            } catch (err) {
                console.error("CartContext fetch error:", err);
                setError('Failed to fetch cart. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    const handleAddToCart = async (productId, quantity) => {
        try {
            const updatedCart = await addToCartService(productId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to add item to cart:', err);
            setError('Failed to add item. Please try again.');
        }
    };

    const handleUpdateCart = async (productId, quantity) => {
        try {
            const updatedCart = await updateCartItemService(productId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to update item:', err);
            setError('Failed to update item. Please try again.');
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const updatedCart = await removeFromCartService(productId);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to remove item:', err);
            setError('Failed to remove item. Please try again.');
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCartBackend();
            setCart(prev => ({ ...prev, items: [], totalPrice: 0 })); // Optimistically update UI
        } catch (err) {
            console.error('Failed to clear cart:', err);
            setError('Failed to clear cart. Please try again.');
        }
    };

    const value = {
        cart,
        loading,
        error,
        addToCart: handleAddToCart,
        updateCartItem: handleUpdateCart,
        removeFromCart: handleRemoveFromCart,
        clearCart: handleClearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
