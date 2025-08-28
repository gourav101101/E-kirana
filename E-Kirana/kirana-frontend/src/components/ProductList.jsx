import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from './ProductCard';

const ProductList = ({ category, searchQuery }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null); // Clear previous errors
                const productData = await getProducts(category, searchQuery);
                setProducts(productData);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, searchQuery]); // Re-run the effect when category or searchQuery changes

    if (loading) {
        return <div className="text-center py-10">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }

    if (products.length === 0) {
        return <div className="text-center py-10 text-gray-500">No products found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
