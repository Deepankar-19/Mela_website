import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const fetchMenu = async () => {
    const response = await api.get('/menu');
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await api.post('/orders/create', orderData);
    return response.data;
};

export const submitUTR = async (utrData) => {
    const response = await api.post('/orders/submit-utr', utrData);
    return response.data;
};

export const fetchOrders = async () => {
    const response = await api.get('/admin/orders');
    return response.data;
};

export const markOrderPaid = async (token) => {
    const response = await api.post(`/admin/mark-paid/${token}`);
    return response.data;
};

export const uploadPaymentScreenshot = async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/orders/upload-screenshot/${token}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;
