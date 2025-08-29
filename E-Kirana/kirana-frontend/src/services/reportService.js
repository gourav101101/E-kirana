import apiClient from './api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const getSalesSummary = async (from, to) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const res = await apiClient.get('/admin/reports/sales', { params });
    return res.data;
};

const getTopProducts = async (limit = 10) => {
    const res = await apiClient.get('/admin/reports/top-products', { params: { limit } });
    return res.data;
};

const getLowStock = async (threshold = 5) => {
    const res = await apiClient.get('/admin/reports/low-stock', { params: { threshold } });
    return res.data;
};

// Accept optional filters object to include in filename
const exportOverallReportToExcel = ({ salesSummary, topProducts = [], lowStock = [] } = {}, filters = {}) => {
    const wb = XLSX.utils.book_new();

    // Sales Summary sheet
    const salesData = [
        ['From', salesSummary?.from || ''],
        ['To', salesSummary?.to || ''],
        ['Total Orders', salesSummary?.totalOrders ?? 0],
        ['Total Revenue', salesSummary?.totalRevenue ?? 0],
    ];
    const wsSales = XLSX.utils.aoa_to_sheet(salesData);
    XLSX.utils.book_append_sheet(wb, wsSales, 'Sales Summary');

    // Top Products sheet
    const topHeader = ['Product ID', 'Name', 'Quantity Sold', 'Total Sales'];
    const topRows = topProducts.map(p => [p.id ?? p.productId, p.name, p.quantitySold ?? p.quantity, p.totalSales ?? p.revenue]);
    const wsTop = XLSX.utils.aoa_to_sheet([topHeader, ...topRows]);
    XLSX.utils.book_append_sheet(wb, wsTop, 'Top Products');

    // Low Stock sheet
    const lowHeader = ['Product ID', 'Name', 'Stock'];
    const lowRows = lowStock.map(p => [p.id ?? p.productId, p.name, p.stock]);
    const wsLow = XLSX.utils.aoa_to_sheet([lowHeader, ...lowRows]);
    XLSX.utils.book_append_sheet(wb, wsLow, 'Low Stock');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Build filename with optional filters
    const parts = [];
    if (filters.from) parts.push(`from-${filters.from.replace(/[:]/g,'')}`);
    if (filters.to) parts.push(`to-${filters.to.replace(/[:]/g,'')}`);
    if (filters.limit) parts.push(`top-${filters.limit}`);
    if (filters.threshold) parts.push(`th-${filters.threshold}`);
    const filterSuffix = parts.length ? `_${parts.join('_')}` : '';

    // Save file once with filter-aware filename
    saveAs(blob, `overall_report_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}${filterSuffix}.xlsx`);
};

export default {
    getSalesSummary,
    getTopProducts,
    getLowStock,
    exportOverallReportToExcel,
};
