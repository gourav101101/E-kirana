import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import CategorySidebar from '../components/CategorySidebar';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gray-100">
            {/*<Navbar />*/}

            {/* Main Content with Sidebar */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <aside className="lg:col-span-3 xl:col-span-2">
                        <CategorySidebar 
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory} 
                        />
                    </aside>
                    <main className="lg:col-span-9 xl:col-span-10 mt-6 lg:mt-0">
                        <ProductList 
                            category={selectedCategory} 
                            searchQuery={searchQuery} 
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
