import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for sessions
});

export const loginUser = async (credentials) => {
    try {
        const response = await axiosInstance.post('login/', credentials);
        if (response.data.data) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMonthlyPayments = async (zoneid, month, year) => {
    try {
        const response = await axiosInstance.post('payments/get_monthly_payments/', {
            zoneid,
            month,
            year
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPayment = async (data) => {
    try {
        const response = await axiosInstance.post('payments/', data);
        return response.data;
    } catch (error) {
        console.error('Error in createPayment:', error);
        throw error.response?.data || error;
    }
};

export const getPaymentByVoucher = async (voucherno) => {
    try {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            throw new Error('Please login first');
        }

        const response = await axiosInstance.get(`payments/by-voucher/${voucherno}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment:', error);
        throw error.response?.data || error;
    }
};

export const getReceiptByVoucher = async (voucherno) => {
    try {
        const userData = localStorage.getItem('user');
        if (!userData) {
            throw new Error('Please login first');
        }

        const response = await axiosInstance.get(`receipts/by-voucher/${voucherno}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createReceipt = async (data) => {
    try {
        // Get CSRF token
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            axiosInstance.defaults.headers['X-CSRFToken'] = csrfToken;
        }

        const response = await axiosInstance.post('receipts/', data);
        return response.data;
    } catch (error) {
        console.error('Error in createReceipt:', error);
        throw error.response?.data || error;
    }
};

export const getPayments = async () => {
    try {
        const response = await axiosInstance.get('payments/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Helper function to get CSRF token
const getCsrfToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

export default { loginUser, createPayment, getPayments };