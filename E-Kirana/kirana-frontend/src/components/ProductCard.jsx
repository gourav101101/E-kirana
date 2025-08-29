import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

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

    // compute discount if available
    const hasOldPrice = product.oldPrice && product.oldPrice > product.price;
    const discountPercent = hasOldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

    const discountColorClass = hasOldPrice
        ? (discountPercent >= 50 ? 'bg-red-600 text-white' : (discountPercent >= 20 ? 'bg-amber-500 text-black' : 'bg-green-500 text-white'))
        : '';

    return (
        <Link to={`/product/${product.id}`} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col no-underline" aria-label={product.name}>
            <div className="relative">
                <img loading="lazy" src={imageUrl} alt={product.name} onLoad={() => setImgLoaded(true)} className={`w-full h-48 object-cover rounded-t-lg bg-gray-100 transition-all duration-500 ${imgLoaded ? 'blur-0 scale-100' : 'blur-sm scale-105'}`} />

                {hasOldPrice && (
                    <div className={`absolute left-2 top-2 text-xs font-bold px-2 py-1 rounded ${discountColorClass}`}>-{discountPercent}%</div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>

                {/* rating */}
                {product.rating !== undefined && (
                    <div className="flex items-center text-sm text-yellow-500 mt-1">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.37 2.449c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.642 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69L9.049 2.927z"/></svg>
                        <span className="text-gray-700">{product.rating}</span>
                        <span className="text-gray-400 ml-2 text-xs">({product.reviewsCount ?? 0})</span>
                    </div>
                )}

                <p className="text-gray-600 mt-2 text-sm line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <div className="text-xl font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</div>
                        {hasOldPrice && <div className="text-sm text-gray-500 line-through">₹{Number(product.oldPrice).toFixed(2)}</div>}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="ml-4 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isAdding || product.stock === 0}
                        aria-disabled={isAdding || product.stock === 0}
                    >
                        {isAdding ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add')}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
