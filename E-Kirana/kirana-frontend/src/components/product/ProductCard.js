import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product.id}`} className="block p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-gray-500">{product.category}</p>
            <div className="mt-2 text-xl font-bold text-indigo-600">
                ₹{product.price.toFixed(2)}
            </div>
        </Link>
    );
};

export default ProductCard;