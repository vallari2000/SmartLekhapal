import React, { useEffect, useState } from "react";
import "./Receipt.css";
import { useNavigate } from "react-router-dom"; 
import { createPayment, getPaymentByVoucher } from '../services/api'; 

const Payment = () => {
  const navigate = useNavigate();
  const [zoneName, setZoneName] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    chqno: "",
    voucherno: "",
    particulars: "",
    amounts: Array(19).fill("")
  });

  const ledgerNames = [
    "adm_fees",
    "pm_fees",
    "apm_fees",
    "fppm_fees",
    "samvad_donation",
    "legal_fund",
    "misc_donation",
    "drf_fees",
    "adv_samvad",
    "interest_sb",
    "interest_fd",
    "investments",
    "guest_house_receipt",
    "building_fund",
    "sundry_receipt",
    "dividend",
    "tds_amount",
    "transfer_to_hq",
    "total_amount"
  ];

  const displayNames = [
    "Admin Fees",
    "PM Fees",
    "APM Fees",
    "FPPM Fees",
    "Samvad Donation",
    "Legal Fund",
    "Misc Donation",
    "DRF Fees",
    "Adv Samvad",
    "Interest SB",
    "Interest FD",
    "Investments",
    "Guest House Receipt",
    "Building Fund",
    "Sundry Receipt",
    "Dividend",
    "TDS Amount",
    "Transfer to HQ",
    "Total Amount"
  ];
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const { zone_name } = JSON.parse(userData);
      setZoneName(zone_name?.toUpperCase() || "ZONAL SUB CENTER");
    }
  }, []);

  // Dividing ledger names into three equal parts
  const columns = Math.ceil(ledgerNames.length / 3);
  const column1 = ledgerNames.slice(0, columns);
  const column2 = ledgerNames.slice(columns, columns * 2);
  const column3 = ledgerNames.slice(columns * 2);

  const displayColumn1 = displayNames.slice(0, columns);
  const displayColumn2 = displayNames.slice(columns, columns * 2);
  const displayColumn3 = displayNames.slice(columns * 2);

  const handleChange = (index, value) => {
    const updatedAmounts = [...formData.amounts];
    updatedAmounts[index] = value;

    // Calculate total (excluding the last element which is total itself)
    const total = updatedAmounts
      .slice(0, -1)
      .reduce((sum, amount) => sum + (Number(amount) || 0), 0);
    updatedAmounts[updatedAmounts.length - 1] = total.toString();

    setFormData({ ...formData, amounts: updatedAmounts });
  };

  const handleSubmit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const submitData = {
        zoneid: userData.zoneid,
        date: formData.date,
        chqno: formData.chqno,
        voucherno: formData.voucherno,
        particulars: formData.particulars,
        amounts: formData.amounts
      };
      
      const response = await createPayment(submitData);
      console.log('Payment created:', response);
      alert('Payment submitted successfully!');
      clearForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting payment');
    }
  };
  const handleView = async () => {
    try {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login first');
            navigate('/login'); // Assuming you're using react-router
            return;
        }

        const voucherNo = prompt("Enter Voucher Number:");
        if (!voucherNo) return;

        console.log('Fetching voucher:', voucherNo); // Debug log
        
        const response = await getPaymentByVoucher(voucherNo);
        console.log('Response:', response); // Debug log
        
        if (response) {
            setFormData({
                date: response.date,
                chqno: response.chqno,
                voucherno: response.voucherno,
                particulars: response.particulars,
                amounts: [
                    response.adm_fees,
                    response.pm_fees,
                    response.apm_fees,
                    response.fppm_fees,
                    response.samvad_donation,
                    response.legal_fund,
                    response.misc_donation,
                    response.drf_fees,
                    response.adv_samvad,
                    response.interest_sb,
                    response.interest_fd,
                    response.investments,
                    response.guest_house_receipt,
                    response.building_fund,
                    response.sundry_receipt,
                    response.dividend,
                    response.tds_amount,
                    response.transfer_to_hq,
                    response.total_amount
                ].map(amount => amount?.toString() || "0")
            });
        }
    } catch (error) {
        console.error('View error:', error);
        if (error.message === 'Please login first' || error.message === 'Please login again to refresh your session') {
            navigate('/login');
        } else {
            alert(error.message || 'Error viewing record');
        }
    }
};

  const clearForm = () => {
    setFormData({
      date: "",
      chqno: "",
      voucherno: "",
      particulars: "",
      amounts: Array(19).fill("")
    });
  };

  return (
    <div className="receipt-form-container">
      <div className="header">
        <div className="header-content">
          <h4>Expenses Entry for {zoneName}</h4>
          <button className="summary-button" onClick={() => navigate('/report', { state: { from: 'payments' } })}>
  Generate Summary
</button>
        </div>
      </div>

      <div className="form-section">
        <div className="form-row-top">
          <div className="input-group">
            <label className="form-label">Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
              className="form-input"
            />
          </div>
          <div className="input-group">
            <label className="form-label">CHQ No.:</label>
            <input
              type="text"
              value={formData.chqno}
              onChange={(e) => setFormData({...formData, chqno: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="input-group">
            <label className="form-label">Voucher No.:</label>
            <input
              type="text"
              value={formData.voucherno}
              onChange={(e) => setFormData({...formData, voucherno: e.target.value.trim()})}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group-full">
            <label className="form-label">Particulars:</label>
            <input
              type="text"
              value={formData.particulars}
              onChange={(e) => setFormData({...formData, particulars: e.target.value.trim()})}
              required
              className="form-input-full"
            />
          </div>
        </div>
      </div>

      <table className="receipt-table">
        <thead>
          <tr>
            <th>Ledger Name</th>
            <th>Amount</th>
            <th>Ledger Name</th>
            <th>Amount</th>
            <th>Ledger Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(column1.length, column2.length, column3.length) }).map(
            (_, rowIndex) => (
              <tr key={rowIndex}>
                <td>{displayColumn1[rowIndex] || ""}</td>
                <td>
                  {displayColumn1[rowIndex] && (
                    <input
                      type="number"
                      value={formData.amounts[rowIndex]}
                      onChange={(e) => handleChange(rowIndex, e.target.value)}
                      placeholder="0.00"
                    />
                  )}
                </td>

                <td>{displayColumn2[rowIndex] || ""}</td>
                <td>
                  {displayColumn2[rowIndex] && (
                    <input
                      type="number"
                      value={formData.amounts[columns + rowIndex]}
                      onChange={(e) => handleChange(columns + rowIndex, e.target.value)}
                      placeholder="0.00"
                    />
                  )}
                </td>

                <td>{displayColumn3[rowIndex] || ""}</td>
                <td>
                  {displayColumn3[rowIndex] && (
                    <input
                      type="number"
                      value={formData.amounts[columns * 2 + rowIndex]}
                      onChange={(e) => handleChange(columns * 2 + rowIndex, e.target.value)}
                      placeholder="0.00"
                    />
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <div className="buttons-container">
        <button onClick={clearForm}>Clear</button>
        <button onClick={handleView}>View</button>
        <button onClick={() => console.log("Delete clicked")}>Delete</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Payment;