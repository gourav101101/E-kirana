// filepath: c:\Users\goura\Downloads\E-Kirana\E-Kirana\kirana-frontend\src\pages\AdminReports.jsx
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import reportService from '../services/reportService.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminReports = () => {
    // Filters
    const [from, setFrom] = useState(''); // datetime-local value
    const [to, setTo] = useState('');
    const [limit, setLimit] = useState(10);
    const [threshold, setThreshold] = useState(5);

    const [sales, setSales] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async (f, t, lim, th) => {
        try {
            setLoading(true);
            // convert to ISO if provided
            const fromIso = f ? new Date(f).toISOString() : undefined;
            const toIso = t ? new Date(t).toISOString() : undefined;

            const [salesResp, topResp, lowResp] = await Promise.all([
                reportService.getSalesSummary(fromIso, toIso),
                reportService.getTopProducts(lim),
                reportService.getLowStock(th),
            ]);
            setSales(salesResp);
            setTopProducts(topResp);
            setLowStock(lowResp);
        } catch (e) {
            console.error(e);
            setError('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(from, to, limit, threshold);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from, to, limit, threshold]);

    const handleExport = () => {
        // prepare filters for filename (send raw ISO strings)
        const filters = {};
        if (from) filters.from = new Date(from).toISOString();
        if (to) filters.to = new Date(to).toISOString();
        if (limit) filters.limit = String(limit);
        if (threshold) filters.threshold = String(threshold);

        reportService.exportOverallReportToExcel({ salesSummary: sales, topProducts, lowStock }, filters);
    };

    if (loading) return <div className="p-6 bg-white rounded shadow">Loading reports...</div>;
    if (error) return <div className="p-6 bg-red-100 text-red-800 rounded">{error}</div>;

    const topLabels = topProducts.map(p => p.name);
    const topQuantities = topProducts.map(p => p.quantitySold ?? p.quantity ?? 0);

    const barData = {
        labels: topLabels,
        datasets: [
            {
                label: 'Quantity Sold',
                data: topQuantities,
                backgroundColor: 'rgba(59,130,246,0.7)'
            }
        ]
    };

    const pieData = {
        labels: lowStock.map(p => p.name),
        datasets: [
            {
                label: 'Stock',
                data: lowStock.map(p => p.stock),
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
            }
        ]
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Overall Reports</h2>
                <div>
                    <button onClick={handleExport} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mr-2">Export to Excel</button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                    <label className="block text-sm text-gray-600">From</label>
                    <input type="datetime-local" value={from} onChange={e => setFrom(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">To</label>
                    <input type="datetime-local" value={to} onChange={e => setTo(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Top products limit</label>
                    <input type="number" min="1" value={limit} onChange={e => setLimit(Number(e.target.value) || 1)} className="mt-1 w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Low stock threshold</label>
                    <input type="number" min="0" value={threshold} onChange={e => setThreshold(Number(e.target.value) || 0)} className="mt-1 w-full border rounded px-2 py-1" />
                </div>
            </div>

            <section className="mb-6">
                <h3 className="text-lg font-medium">Sales Summary</h3>
                {sales ? (
                    <div className="mt-2">
                        <p>Total Orders: <strong>{sales.totalOrders}</strong></p>
                        <p>Total Revenue: <strong>₹{sales.totalRevenue.toFixed(2)}</strong></p>
                        <p>From: <strong>{sales.from ? new Date(sales.from).toLocaleString() : '-'}</strong> To: <strong>{sales.to ? new Date(sales.to).toLocaleString() : '-'}</strong></p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No sales data.</p>
                )}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">Top Products</h3>
                    {topProducts.length ? (
                        <Bar data={barData} />
                    ) : (
                        <p className="text-sm text-gray-500">No top products data.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Low Stock</h3>
                    {lowStock.length ? (
                        <Pie data={pieData} />
                    ) : (
                        <p className="text-sm text-gray-500">No low stock items.</p>
                    )}
                </div>
            </section>

            <section className="mt-6">
                <h3 className="text-lg font-medium mb-2">Low Stock List</h3>
                {lowStock.length ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-2">Product</th>
                                <th className="py-2">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.map(item => (
                                <tr key={item.productId ?? item.id} className="border-t">
                                    <td className="py-2">{item.name}</td>
                                    <td className="py-2">{item.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-sm text-gray-500">No low stock items.</p>
                )}
            </section>
        </div>
    );
};

export default AdminReports;
