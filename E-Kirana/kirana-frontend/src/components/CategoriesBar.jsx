import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/productService';

const CategoriesBar = ({ selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                const data = await getCategories();
                if (mounted) setCategories(data);
            } catch (e) {
                console.error('Failed to load categories', e);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="bg-white rounded-lg shadow px-3 py-2 overflow-x-auto">
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium ${selectedCategory === null ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    All
                </button>

                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoriesBar;

