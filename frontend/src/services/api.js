import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}login/`, {
            username: credentials.username,
            password: credentials.password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getMonthlyPayments = async (zoneid, month, year) => {
    try {
        const response = await axios.post(`${API_URL}payments/report/`, {
            zoneid,
            month,
            year
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const createPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}payments/`, {
            zoneid: paymentData.zoneid,
            date: paymentData.date,
            chqno: paymentData.chqno,
            voucherno: paymentData.voucherno,
            particulars: paymentData.particulars,
            adm_fees: paymentData.amounts[0] || null,
            pm_fees: paymentData.amounts[1] || null,
            apm_fees: paymentData.amounts[2] || null,
            fppm_fees: paymentData.amounts[3] || null,
            samvad_donation: paymentData.amounts[4] || null,
            legal_fund: paymentData.amounts[5] || null,
            misc_donation: paymentData.amounts[6] || null,
            drf_fees: paymentData.amounts[7] || null,
            adv_samvad: paymentData.amounts[8] || null,
            interest_sb: paymentData.amounts[9] || null,
            interest_fd: paymentData.amounts[10] || null,
            investments: paymentData.amounts[11] || null,
            guest_house_receipt: paymentData.amounts[12] || null,
            building_fund: paymentData.amounts[13] || null,
            sundry_receipt: paymentData.amounts[14] || null,
            dividend: paymentData.amounts[15] || null,
            tds_amount: paymentData.amounts[16] || null,
            transfer_to_hq: paymentData.amounts[17] || null,
            suspense: paymentData.amounts[18] || null,
            total_amount: paymentData.amounts[19] || null
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPayments = async () => {
    try {
        const response = await axios.get(`${API_URL}payments/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default { loginUser, createPayment, getPayments };