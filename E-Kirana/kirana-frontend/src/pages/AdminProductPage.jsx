import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import ProductFormModal from '../components/ProductFormModal';


const AdminProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Use useCallback to memoize the fetch function, preventing re-creation on every render
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const productData = await getProducts();
            console.log('Fetched Products:', productData);
            setProducts(productData);
        } catch (err) {
            setError('Failed to fetch products.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddNew = () => {
        console.log('Add New Product Clicked');
        setEditingProduct(null); // Ensure form is empty for new product
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        console.log('Edit Product Clicked:', product);
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId) => {
        console.log('Delete Product Clicked:', productId);
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await deleteProduct(productId);
                console.log('Delete Response:', res);
                fetchProducts(); // Refresh the list after deleting
            } catch (err) {
                console.error('Failed to delete product:', err);
                setError('Failed to delete product.');
            }
        }
    };

    const handleSave = async (productData) => {
        console.log('Save Product Clicked:', productData);
        try {
            let res;
            if (editingProduct) {
                // Update existing product
                res = await updateProduct(editingProduct.id, productData);
                console.log('Update Response:', res);
            } else {
                // Create new product
                res = await createProduct(productData);
                console.log('Create Response:', res);
            }
            fetchProducts(); // Refresh the list after saving
            setIsModalOpen(false); // Close the modal
        } catch (err) {
            console.error('Failed to save product:', err);
            setError('Failed to save product.');
        }
    };

    if (loading) return <div className="text-center p-10">Loading products...</div>;
    if (error) return <div className="text-center p-10 text-red-600">{error}</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    + Add New Product
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                product={editingProduct}
            />
        </>
    );
};

export default AdminProductPage;
