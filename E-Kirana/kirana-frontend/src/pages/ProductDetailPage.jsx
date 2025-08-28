import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const productData = await getProductById(id);
                setProduct(productData);

                if (productData && productData.category) {
                    const allProducts = await getProducts(productData.category);
                    const similar = allProducts.filter(p => p.id !== productData.id).slice(0, 4);
                    setSimilarProducts(similar);
                }

            } catch (err) {
                setError('Could not find product.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        // Scroll to top when the page loads for a new product
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product.id, quantity);
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-10 bg-white p-8 rounded-lg shadow-md">
                    <div className="lg:w-1/2">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-auto max-h-96 object-contain rounded-lg" />
                    </div>
                    <div className="lg:w-1/2 flex flex-col">
                        <span className="inline-block bg-indigo-100 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full mb-2 w-max">{product.category}</span>
                        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                        <p className="mt-4 text-gray-600 text-lg">{product.description}</p>
                        <p className="mt-4 text-3xl font-extrabold text-gray-900">₹{product.price.toFixed(2)}</p>
                        <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</p>

                        <div className="mt-6 flex items-center gap-4">
                            <label htmlFor="quantity" className="font-semibold">Quantity:</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))} 
                                min="1" 
                                max={product.stock} 
                                className="w-20 p-2 border rounded-md text-center"
                                disabled={product.stock === 0}
                            />
                        </div>

                        <div className="mt-auto pt-6">
                            <button 
                                onClick={handleAddToCart} 
                                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={product.stock === 0}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {similarProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
