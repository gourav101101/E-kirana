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
    const [activeImage, setActiveImage] = useState(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const productData = await getProductById(id);
                setProduct(productData);
                setActiveImage(productData?.imageUrl || null);

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

    const handleAddToCart = async () => {
        if (!product || adding) return;
        try {
            setAdding(true);
            await addToCart(product.id, quantity);
            setAdded(true);
            // clear added indicator after short delay
            setTimeout(() => setAdded(false), 1400);
        } catch (err) {
            console.error('Add to cart error:', err);
        } finally {
            setAdding(false);
        }
    };

    const increase = () => {
        setQuantity(q => Math.min((product?.stock) || 999, q + 1));
    };
    const decrease = () => {
        setQuantity(q => Math.max(1, q - 1));
    };

    const discountPercent = product?.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to={`/product?category=${encodeURIComponent(product.category)}`} className="hover:underline">{product.category}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700">{product.name}</span>
                </nav>
                <div className="flex flex-col lg:flex-row gap-10 bg-white p-8 rounded-lg shadow-md">
                    {/* Left: Images */}
                    <div className="lg:w-1/2">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="w-full h-96 flex items-center justify-center bg-white rounded">
                                <img
                                    loading="lazy"
                                    src={activeImage || product.imageUrl}
                                    alt={product.name}
                                    onLoad={() => setImgLoaded(true)}
                                    className={`max-h-80 w-auto object-contain transition-all duration-500 ${imgLoaded ? 'blur-0 scale-100' : 'blur-sm scale-105'}`}
                                />
                            </div>
                            {/* thumbnails (if product.images exists) */}
                            <div className="mt-4 flex gap-3 overflow-x-auto">
                                {(product.images || [product.imageUrl]).map((src, i) => (
                                    <button key={i} onClick={() => { setActiveImage(src); setImgLoaded(false); }} className={`w-20 h-20 rounded border ${activeImage === src ? 'ring-2 ring-indigo-500' : 'border-gray-200'} overflow-hidden bg-white`}>
                                        <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details + sticky purchase box */}
                    <div className="lg:w-1/2 flex flex-col">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="inline-block bg-indigo-100 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full mb-2 w-max">{product.category}</span>
                                {discountPercent > 0 && <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">-{discountPercent}%</span>}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>

                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center text-yellow-500">
                                    <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.37 2.449c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.642 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69L9.049 2.927z"/></svg>
                                    <span className="text-gray-700 font-semibold">{product.rating?.toFixed?.(1) ?? (product.rating ?? '—')}</span>
                                    <span className="text-sm text-gray-400">({product.reviewsCount ?? 0})</span>
                                </div>
                            </div>

                            <p className="mt-4 text-gray-600 text-base">{product.shortDescription || product.description}</p>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-baseline gap-4">
                                <div className="text-3xl font-extrabold text-gray-900">₹{Number(product.price).toFixed(2)}</div>
                                {product.oldPrice && <div className="text-sm text-gray-500 line-through">₹{Number(product.oldPrice).toFixed(2)}</div>}
                            </div>
                            <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</p>
                        </div>

                        <div className="mt-6 lg:mt-8 sticky top-28 bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border rounded-md overflow-hidden">
                                    <button onClick={decrease} className="px-3 py-2 bg-gray-100">-</button>
                                    <input value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} type="number" className="w-20 text-center p-2" min="1" max={product.stock} disabled={product.stock === 0} />
                                    <button onClick={increase} className="px-3 py-2 bg-gray-100">+</button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || adding}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg ${adding ? 'bg-indigo-600/90 cursor-wait' : added ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white disabled:bg-gray-400`}
                                >
                                    {adding ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M14 2a1 1 0 00-2 0v4a1 1 0 002 0V2z"></path>
                                        </svg>
                                    ) : added ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                                            <span>Added</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white" aria-hidden="true">
                                                <path d="M6 6h15l-1.5 9h-12z" />
                                                <circle cx="9" cy="20" r="1" />
                                                <circle cx="18" cy="20" r="1" />
                                            </svg>
                                            <span>Add to cart</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="mt-3 text-sm text-gray-500">Secure checkout · Easy returns</div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-6">
                            <div className="flex gap-4 border-b pb-2">
                                <button onClick={() => setActiveTab('description')} className={`pb-2 ${activeTab === 'description' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}>Description</button>
                                <button onClick={() => setActiveTab('reviews')} className={`pb-2 ${activeTab === 'reviews' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}>Reviews ({product.reviewsCount ?? 0})</button>
                            </div>
                            <div className="mt-4 text-gray-700">
                                {activeTab === 'description' ? (
                                    <div className="prose max-w-none">{product.description}</div>
                                ) : (
                                    <div>
                                        {product.reviews && product.reviews.length > 0 ? (
                                            product.reviews.map((r, i) => (
                                                <div key={i} className="border-b py-3">
                                                    <div className="font-semibold">{r.author}</div>
                                                    <div className="text-sm text-gray-600">{r.comment}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500">No reviews yet. Be the first to review this product.</div>
                                        )}
                                    </div>
                                )}
                            </div>
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
