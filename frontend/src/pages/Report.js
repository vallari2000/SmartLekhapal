import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Report.css';
import { getMonthlyPayments, getMonthlyReceipts } from '../services/api';

const Report = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [reportType, setReportType] = useState('payments'); // 'payments' or 'receipts'

  // Define periods array
  const periods = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: '6monthly', label: '6 Monthly' },
    { id: 'yearly', label: 'Yearly' }
  ];

  // Define months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years from current year - 5 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 6 }, 
    (_, index) => currentYear - index
  );

  useEffect(() => {
    // Determine report type based on the previous page
    const fromReceipts = location.state?.from === 'receipts';
    setReportType(fromReceipts ? 'receipts' : 'payments');

    const userData = localStorage.getItem('user');
    if (userData) {
      const { zone_name } = JSON.parse(userData);
      setZoneName(zone_name?.toUpperCase() || "");
    }
  }, [location]);

  const fetchData = async (month, year) => {
    try {
        const userData = localStorage.getItem('user');
        if (!userData) {
            console.error('No user data found in localStorage');
            return;
        }

        const parsedUserData = JSON.parse(userData);
        console.log('User data from localStorage:', parsedUserData);

        // Change this check - we should check if zoneid is undefined or null, not if it's falsy
        if (parsedUserData.zoneid === undefined || parsedUserData.zoneid === null) {
            console.error('No zoneid found in user data');
            return;
        }

        const fetchFunction = reportType === 'receipts' ? getMonthlyReceipts : getMonthlyPayments;
        const data = await fetchFunction(parsedUserData.zoneid, month, year);
        setMonthlyData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  const handleMonthSelect = async (month) => {
    setSelectedMonth(month);
    await fetchData(month, selectedYear);
  };

  const handleYearChange = async (e) => {
    const selectedYearValue = Number(e.target.value);
    setSelectedYear(selectedYearValue);
    if (selectedMonth) {
      await fetchData(selectedMonth, selectedYearValue);
    }
  };

  const renderMonthYearSelector = () => (
    <div className="selector-container">
      <div className="month-buttons">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthSelect(month)}
            className={`month-button ${selectedMonth === month ? 'active' : ''}`}
          >
            {month}
          </button>
        ))}
      </div>
      <div className="year-selector">
        <select 
          value={selectedYear}
          onChange={handleYearChange}
          className="year-select"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderTable = () => (
    <div>
      <h2>{selectedMonth} {selectedYear} {reportType === 'receipts' ? 'Receipts' : 'Payments'} Report for {zoneName}</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>CHQ No</th>
              <th>Voucher No</th>
              <th>Particulars</th>
              <th>Admin Fees</th>
              <th>PM Fees</th>
              <th>APM Fees</th>
              <th>FPPM Fees</th>
              <th>Samvad Donation</th>
              <th>Legal Fund</th>
              <th>Misc Donation</th>
              <th>DRF Fees</th>
              <th>Adv Samvad</th>
              <th>Interest SB</th>
              <th>Interest FD</th>
              <th>Investments</th>
              <th>Guest House Receipt</th>
              <th>Building Fund</th>
              <th>Sundry Receipt</th>
              <th>Dividend</th>
              <th>TDS Amount</th>
              <th>{reportType === 'receipts' ? 'Transfer from HQ' : 'Transfer to HQ'}</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>{row.chqno}</td>
                <td>{row.voucherno}</td>
                <td>{row.particulars}</td>
                <td>₹{row.adm_fees?.toFixed(2) || '0.00'}</td>
                <td>₹{row.pm_fees?.toFixed(2) || '0.00'}</td>
                <td>₹{row.apm_fees?.toFixed(2) || '0.00'}</td>
                <td>₹{row.fppm_fees?.toFixed(2) || '0.00'}</td>
                <td>₹{row.samvad_donation?.toFixed(2) || '0.00'}</td>
                <td>₹{row.legal_fund?.toFixed(2) || '0.00'}</td>
                <td>₹{row.misc_donation?.toFixed(2) || '0.00'}</td>
                <td>₹{row.drf_fees?.toFixed(2) || '0.00'}</td>
                <td>₹{row.adv_samvad?.toFixed(2) || '0.00'}</td>
                <td>₹{row.interest_sb?.toFixed(2) || '0.00'}</td>
                <td>₹{row.interest_fd?.toFixed(2) || '0.00'}</td>
                <td>₹{row.investments?.toFixed(2) || '0.00'}</td>
                <td>₹{row.guest_house_receipt?.toFixed(2) || '0.00'}</td>
                <td>₹{row.building_fund?.toFixed(2) || '0.00'}</td>
                <td>₹{row.sundry_receipt?.toFixed(2) || '0.00'}</td>
                <td>₹{row.dividend?.toFixed(2) || '0.00'}</td>
                <td>₹{row.tds_amount?.toFixed(2) || '0.00'}</td>
                <td>₹{row[reportType === 'receipts' ? 'transfer_from_hq' : 'transfer_to_hq']?.toFixed(2) || '0.00'}</td>
                <td>₹{row.total_amount?.toFixed(2) || '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="selection-panel-container">
      <div className="period-buttons">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => {
              setSelected(period.id);
              setSelectedMonth(null);
              setMonthlyData([]);
            }}
            className={`period-button ${selected === period.id ? 'active' : ''}`}
          >
            {period.label}
          </button>
        ))}
      </div>
      
      {selected === 'monthly' && (
        <>
          {renderMonthYearSelector()}
          <div className="content-panel">
            {selectedMonth && renderTable()}
          </div>
        </>
      )}
      
      {selected !== 'monthly' && (
        <div className="content-panel">
          <p>Select {selected} data</p>
        </div>
      )}
    </div>
  );
};

export default Report;