import React, { useEffect, useState, useRef } from 'react';
import { getFeaturedProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import defaultImage from '../assets/ekiranaicon.png';
import apiClient from '../services/api';

const FeaturedCarousel = ({ interval = 4000 }) => {
    const [items, setItems] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef(null);
    const { addToCart } = useCart();
    const [imgSrc, setImgSrc] = useState(defaultImage);

    const apiBase = apiClient?.defaults?.baseURL || '';

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                const data = await getFeaturedProducts();
                if (mounted) setItems(data || []);
            } catch (e) {
                console.error('Failed to load featured products', e);
                // Fallback: show a local placeholder so the UI remains functional
                if (mounted) setItems([{
                    id: 'fallback-1',
                    name: 'E-Kirana Featured',
                    description: 'Explore our fresh selection',
                    price: 0.0,
                    oldPrice: null,
                    imageUrl: defaultImage
                }]);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (!items.length) return;
        timerRef.current = setInterval(() => {
            setIndex(prev => (prev + 1) % items.length);
        }, interval);
        return () => clearInterval(timerRef.current);
    }, [items, interval]);

    // keep imgSrc in sync when current item changes
    useEffect(() => {
        if (!items.length) return;
        const current = items[index] || {};
        let url = current.imageUrl || '';
        // If imageUrl is empty or falsy, use default
        if (!url) {
            setImgSrc(defaultImage);
            return;
        }
        // If url starts with http(s), use as-is. If it starts with '/', prefix apiBase.
        if (/^https?:\/\//i.test(url)) {
            setImgSrc(url);
            return;
        }
        if (url.startsWith('/')) {
            setImgSrc(apiBase + url);
            return;
        }
        // relative path without leading slash -> also prefix
        setImgSrc(apiBase ? `${apiBase}/${url}` : url);
    }, [items, index, apiBase]);

    const prev = () => {
        clearInterval(timerRef.current);
        setIndex(i => (i - 1 + items.length) % items.length);
    };
    const next = () => {
        clearInterval(timerRef.current);
        setIndex(i => (i + 1) % items.length);
    };

    const handleAdd = async (e, id) => {
        e.stopPropagation();
        try {
            await addToCart(id, 1);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
        );
    }

    if (!items.length) {
        return (
            <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">No featured products</div>
        );
    }

    const current = items[index];

    return (
        <div className="w-full relative">
            <div className="rounded-lg overflow-hidden h-64 bg-white shadow flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
                    <div>
                        <img
                            loading="lazy"
                            crossOrigin="anonymous"
                            src={imgSrc}
                            alt={current.name}
                            onError={() => {
                                console.error('FeaturedCarousel: failed to load image:', imgSrc);
                                setImgSrc(defaultImage);
                            }}
                            className="max-h-56 w-auto object-contain"
                        />
                        <div className="text-xs text-gray-400 mt-2">Source: {current.imageUrl || '(none — using fallback)'}</div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="text-sm text-gray-500">Featured</div>
                    <h3 className="text-2xl font-bold text-gray-900">{current.name}</h3>
                    <p className="mt-2 text-gray-600 line-clamp-3">{current.description}</p>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-2xl font-bold">₹{Number(current.price).toFixed(2)}</div>
                        {current.oldPrice && (
                            <div className="text-sm text-gray-500 line-through">₹{Number(current.oldPrice).toFixed(2)}</div>
                        )}
                        <button onClick={(e) => handleAdd(e, current.id)} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add to cart</button>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow">‹</button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow">›</button>

            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {items.map((it, i) => (
                    <button key={it.id} onClick={() => { clearInterval(timerRef.current); setIndex(i); }} className={`w-3 h-3 rounded-full ${i === index ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedCarousel;
