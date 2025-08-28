import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/productService';

const CategorySidebar = ({ onSelectCategory, selectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData);
            } catch (err) {
                setError('Could not load categories.');
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const getButtonClasses = (category) => {
        const baseClasses = 'w-full text-left px-4 py-2 rounded-md transition-colors duration-200';
        if (category === selectedCategory) {
            // CORRECTED: Replaced ' with ` to close the template literal
            return `${baseClasses} bg-indigo-600 text-white font-semibold`;
        } else {
            // CORRECTED: Replaced ' with ` to close the template literal
            return `${baseClasses} text-gray-700 hover:bg-gray-200`;
        }
    };

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Categories</h3>
            <ul className="space-y-2">
                <li>
                    <button 
                        onClick={() => onSelectCategory(null)} // Pass null to show all products
                        className={getButtonClasses(null)}
                    >
                        All Products
                    </button>
                </li>
                {categories.map(category => (
                    <li key={category}>
                        <button 
                            onClick={() => onSelectCategory(category)}
                            className={getButtonClasses(category)}
                        >
                            {category}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;
