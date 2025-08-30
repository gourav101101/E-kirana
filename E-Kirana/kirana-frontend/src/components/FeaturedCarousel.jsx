// Fix and clean FeaturedCarousel component: single valid React component, stable fetch/fallback logic, autoplay, pause-on-hover, thumbnails, safe image handling
import React, { useEffect, useState, useRef } from 'react';
import { getFeaturedProducts, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import defaultImage from '../assets/ekiranaicon.png';
import imageService from '../services/imageService';

const FeaturedCarousel = ({ interval = 4000, maxItems = 5 }) => {
    const [items, setItems] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fallbackUsed, setFallbackUsed] = useState(false);
    const [addingId, setAddingId] = useState(null);
    const [addedId, setAddedId] = useState(null);
    const timerRef = useRef(null);
    const containerRef = useRef(null);
    const { addToCart } = useCart();
    const [imgSrc, setImgSrc] = useState(defaultImage);

    useEffect(() => {
        let mounted = true;
        const fetchItems = async () => {
            try {
                let data = await getFeaturedProducts();
                if ((!data || !data.length) && mounted) {
                    const fallback = await getProducts();
                    const list = Array.isArray(fallback) ? fallback : (fallback?.content || []);
                    data = list.slice(0, maxItems);
                    if (data && data.length) setFallbackUsed(true);
                }
                if (mounted) {
                    setItems(Array.isArray(data) ? data.slice(0, maxItems) : []);
                    setIndex(0);
                    setImgSrc(defaultImage);
                }
            } catch (err) {
                console.error('FeaturedCarousel fetch error:', err);
                if (mounted) setItems([{ id: 'fallback-1', name: 'E-Kirana Featured', description: 'Explore our fresh selection', price: 0.0, oldPrice: null, imageUrl: defaultImage }]);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchItems();
        return () => { mounted = false; };
    }, [maxItems]);

    useEffect(() => {
        if (!items.length) return;
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setIndex(i => (i + 1) % items.length), interval);
        return () => clearInterval(timerRef.current);
    }, [items, interval]);

    useEffect(() => {
        if (!items.length) return;
        const current = items[index] || {};
        const resolved = imageService.resolveImageUrl(current.imageUrl || defaultImage) || defaultImage;
        try {
            setImgSrc(typeof resolved === 'string' ? resolved : String(resolved || defaultImage));
        } catch (e) {
            setImgSrc(defaultImage);
        }
    }, [items, index]);

    const handleImgError = (e) => {
        const failed = e?.target?.src;
        if (failed && failed !== defaultImage) setImgSrc(defaultImage);
    };

    const prev = () => {
        clearInterval(timerRef.current);
        setIndex(i => (i - 1 + items.length) % items.length);
    };
    const next = () => {
        clearInterval(timerRef.current);
        setIndex(i => (i + 1) % items.length);
    };

    const handleMouseEnter = () => clearInterval(timerRef.current);
    const handleMouseLeave = () => {
        if (items.length) {
            clearInterval(timerRef.current);
            timerRef.current = setInterval(() => setIndex(i => (i + 1) % items.length), interval);
        }
    };

    // handle add-to-cart with visual feedback (loading state and temporary "added" state)
    const handleAdd = async (e, id) => {
        e.stopPropagation();
        if (!id || addingId === id) return;
        try {
            setAddingId(id);
            await addToCart(id, 1);
            setAddedId(id);
            // clear "added" indicator after short delay
            setTimeout(() => setAddedId(null), 1400);
        } catch (err) {
            console.error('Add to cart error:', err);
        } finally {
            setAddingId(null);
        }
    };

    if (loading) return <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />;

    if (!items.length) {
        return (
            <div className="w-full rounded-lg overflow-hidden h-64 bg-white shadow flex items-center justify-center p-6">
                <div className="flex items-center gap-6">
                    <img src={defaultImage} alt="No featured" className="h-40 w-40 object-contain" />
                    <div>
                        <h3 className="text-lg font-semibold">No featured products</h3>
                        <p className="text-sm text-gray-600 mt-1">We don't have featured items right now. Browse our catalog to add featured items.</p>
                    </div>
                </div>
            </div>
        );
    }

    const current = items[index] || {};

    return (
        <div ref={containerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-full relative">
            <div className="rounded-lg overflow-hidden h-64 bg-white shadow flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 bg-gradient-to-b from-white/40 to-gray-50 flex items-center justify-center p-4">
                    <div className="relative w-full h-56 flex items-center justify-center">
                        <img loading="lazy" src={imgSrc} alt={String(current.name || '')} onError={handleImgError} className="max-h-56 w-auto object-contain transition-all duration-300" />
                        <div className="absolute left-3 top-3 bg-white/80 text-xs text-gray-700 px-2 py-1 rounded shadow">{fallbackUsed ? 'Trending' : 'Featured'}</div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="text-sm text-gray-500">{fallbackUsed ? 'Trending now' : 'Featured'}</div>
                    <h3 className="text-2xl font-bold text-gray-900">{current.name}</h3>
                    <p className="mt-2 text-gray-600 line-clamp-3">{current.description}</p>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-2xl font-extrabold text-indigo-700">₹{Number(current.price || 0).toFixed(2)}</div>
                        {current.oldPrice && <div className="text-sm text-gray-500 line-through">₹{Number(current.oldPrice).toFixed(2)}</div>}
                        {/* compact add-to-cart with icon: make fixed min-width and prevent collapse */}
                        <button
                            onClick={(e) => handleAdd(e, current.id)}
                            className={`ml-auto flex-none inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md shadow-sm min-w-[64px] ${addingId === current.id ? 'bg-indigo-600/90 cursor-wait' : addedId === current.id ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            aria-label={`Add ${current.name} to cart`}
                            disabled={addingId === current.id}
                        >
                            {addingId === current.id ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M14 2a1 1 0 00-2 0v4a1 1 0 002 0V2z"></path>
                                </svg>
                            ) : addedId === current.id ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                                    <span className="hidden md:inline text-white">Added</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white" aria-hidden="true">
                                        <path d="M6 6h15l-1.5 9h-12z" />
                                        <circle cx="9" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                    </svg>
                                    <span className="hidden md:inline">Add</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 hidden sm:flex items-center gap-2 flex-nowrap overflow-hidden no-scrollbar">
                        {items.map((it, i) => (
                            <button
                                key={it.id}
                                onClick={() => { clearInterval(timerRef.current); setIndex(i); }}
                                className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border ${i === index ? 'ring-2 ring-indigo-500 scale-105' : 'border-gray-200'} transition-transform duration-150`}
                                title={it.name}
                                aria-label={`Show ${it.name}`}>
                                <img src={imageService.resolveImageUrl(it.imageUrl || defaultImage)} alt={it.name} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* navigation arrows hidden by request (kept functions for programmatic control) */}
            {/*<button aria-label="Previous" onClick={prev} className="absolute -left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 z-70 rounded-full w-12 h-12 flex items-center justify-center shadow-xl text-white transition ring-1 ring-white/25">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button aria-label="Next" onClick={next} className="absolute -right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 z-70 rounded-full w-12 h-12 flex items-center justify-center shadow-xl text-white transition ring-1 ring-white/25">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
            </button>*/}

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    {items.map((it, i) => (
                        <button key={it.id} onClick={() => { clearInterval(timerRef.current); setIndex(i); }} className={`w-3 h-3 rounded-full ${i === index ? 'bg-indigo-600' : 'bg-gray-300'}`} aria-label={`Go to ${i + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedCarousel;
