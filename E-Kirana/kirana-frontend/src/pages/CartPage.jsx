import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, removeFromCart, updateCartItem, loading, error, itemCount } = useCart();

    if (loading) {
        return <div className="text-center py-10">Loading your cart...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }

    if (!cart || itemCount === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity > 0) {
            updateCartItem(productId, newQuantity);
        } else {
            // If quantity becomes 0, remove the item from the cart
            removeFromCart(productId);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {cart.items.map(item => (
                            <li key={item.product.id} className="p-6 flex items-center space-x-6">
                                <img src={item.product.imageUrl || 'https://via.placeholder.com/150'} alt={item.product.name} className="w-24 h-24 rounded-md object-cover"/>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                                    <p className="text-gray-600">₹{item.product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)} className="px-3 py-1 border rounded-md">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)} className="px-3 py-1 border rounded-md">+</button>
                                </div>
                                <p className="font-semibold w-24 text-right">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">Remove</button>
                            </li>
                        ))}
                    </ul>

                    <div className="p-6 bg-gray-50 flex justify-end items-center">
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">Total: ₹{cart.totalPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Shipping & taxes calculated at checkout.</p>
                            <Link to="/checkout" className="mt-4 inline-block w-full text-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
