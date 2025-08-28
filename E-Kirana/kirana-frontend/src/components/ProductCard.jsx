import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const imageUrl = product.imageUrl || 'https://via.placeholder.com/300';

    const handleAddToCart = async (e) => {
        // Stop the click from propagating to the parent Link component
        e.stopPropagation();
        e.preventDefault();

        setIsAdding(true);
        try {
            await addToCart(product.id, 1);
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        }
        setIsAdding(false);
    };

    return (
        <Link to={`/product/${product.id}`} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col no-underline">
            <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-600 mt-1 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                    <button 
                        onClick={handleAddToCart}
                        className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isAdding || product.stock === 0}
                    >
                        {isAdding ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
