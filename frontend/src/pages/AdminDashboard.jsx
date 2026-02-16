import React, { useEffect, useState } from 'react';
import { fetchOrders, markOrderPaid } from '../services/api';
import toast from 'react-hot-toast';
import { Check, Clock, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            // Sort by status (pending first) then by ID (newest first)
            const sorted = data.sort((a, b) => {
                if (a.status === b.status) return b.id - a.id;
                return a.status === 'pending' ? -1 : 1;
            });
            setOrders(sorted);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPaid = async (token) => {
        if (!window.confirm(`Are you sure you want to mark order #${token} as PAID?`)) return;

        try {
            await markOrderPaid(token);
            toast.success(`Order #${token} marked as paid`);
            loadOrders();
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard - Orders</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Info</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.token_number} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        #{order.token_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                        <div className="text-sm text-gray-500">{order.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 max-w-xs truncate" title={JSON.stringify(order.items)}>
                                            {Object.entries(order.items).map(([name, qty]) => (
                                                <div key={name}>{name} x {qty}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₹{order.total_price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.utr_number ? (
                                            <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-yellow-800">UTR: {order.utr_number}</span>
                                        ) : (
                                            <span className="text-gray-400 italic">No UTR yet</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {order.status !== 'paid' && (
                                            <button
                                                onClick={() => handleMarkPaid(order.token_number)}
                                                className="text-green-600 hover:text-green-900 flex items-center gap-1 bg-green-50 px-3 py-1 rounded border border-green-200 hover:bg-green-100 transition"
                                            >
                                                <Check size={16} /> Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
