import React, { useState , useEffect} from "react";
import "./Receipt.css";
import { createReceipt, getReceiptByVoucher } from '../services/api'; 
import { useNavigate } from "react-router-dom"; 

const Receipt = () => {
  const navigate = useNavigate();
  const [zoneName, setZoneName] = useState("");
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
    "transfer_from_hq",
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
    "Transfer from HQ",
    "Total Amount"
];
  // Dividing ledger names into three equal parts
  const columns = Math.ceil(ledgerNames.length / 3);
  const column1 = ledgerNames.slice(0, columns);
  const column2 = ledgerNames.slice(columns, columns * 2);
  const column3 = ledgerNames.slice(columns * 2);

  const [formData, setFormData] = useState({
    date: '',
    chqno: '',  // Changed from cheque_no to match backend
    voucherno: '', // Changed from voucher_no to match backend
    particulars: '',
    amounts: Array(19).fill("")
});

const handleChange = (index, value) => {
  const updatedAmounts = [...formData.amounts];
  updatedAmounts[index] = value;
  
  // Calculate total (excluding the last element which is the total itself)
  const total = updatedAmounts
      .slice(0, -1)  // Get all elements except the last one
      .reduce((sum, amount) => sum + (Number(amount) || 0), 0);
  
  // Update the total amount (last element in the array)
  updatedAmounts[updatedAmounts.length - 1] = total.toString();
  
  setFormData({ ...formData, amounts: updatedAmounts });
};

  const clearForm = () => {
    setFormData({
        date: '',
        chqno: '',    // Changed from chqno
        voucherno: '',   // Changed from voucherno
        particulars: '',
        amounts: Array(ledgerNames.length).fill("")
    });
};

  // In Receipt.js
  const handleSubmit = async () => {
    try {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login first');
            return;
        }

        console.log("Form Data at submission:", {
            date: formData.date,
            voucherno: formData.voucherno,
            particulars: formData.particulars,
        });

        // Validate required fields
        if (!formData.date || !formData.voucherno || !formData.particulars) {
            console.log("Missing required fields:", {
                date: !formData.date,
                voucherno: !formData.voucherno,
                particulars: !formData.particulars
            });
            alert('Please fill in all required fields (Date, Voucher No, and Particulars)');
            return;
        }

        const user = JSON.parse(userData);
        
        // Convert amounts to numbers and handle empty strings
        const numericAmounts = formData.amounts.map(amount => 
            amount === "" ? 0 : parseFloat(amount)
        );

        const total = numericAmounts.slice(0, -1).reduce((sum, amount) => sum + amount, 0);
        numericAmounts[numericAmounts.length - 1] = total;

        const submitData = {
            zoneid: user.zoneid,
            date: formData.date,
            chqno: formData.chqno,
            voucherno: formData.voucherno,
            particulars: formData.particulars,
            amounts: numericAmounts
        };

        console.log('Final submit data:', submitData);

        const response = await createReceipt(submitData);
        console.log('Receipt created:', response);
        alert('Receipt submitted successfully!');
        clearForm();
    } catch (error) {
        console.error('Submission error:', error.response?.data || error);
        const errorMessage = error.response?.data?.error || 'Error submitting receipt. Please try again.';
        alert(errorMessage);
    }
};

  const handleDelete = () => {
    alert("Delete Functionality Here!");
  };

  const handleView = async () => {
    try {
        const userData = localStorage.getItem('user');
        if (!userData) {
            alert('Please login first');
            navigate('/login');
            return;
        }

        const voucherNo = prompt("Enter Voucher Number:");
        if (!voucherNo) return;

        console.log('Fetching receipt with voucher number:', voucherNo);
        
        const response = await getReceiptByVoucher(voucherNo);
        console.log('Receipt data received:', response);

        if (response) {
            setFormData({
                date: response.date,
                chqno: response.chqno?.toString() || '',
                voucherno: response.voucherno?.toString() || '',
                particulars: response.particulars || '',
                amounts: [
                    // ... your amounts array ...
                ].map(amount => amount?.toString() || "0")
            });
        }
    } catch (error) {
        console.error('View error:', error);
        if (error.response?.status === 404) {
            alert(error.response.data.message || 'Voucher number not present');
        } else if (error.response?.status === 401) {
            alert('Session expired. Please login again');
            navigate('/login');
        } else {
            alert('Error viewing receipt');
        }
    }
};

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
        const { zone_name } = JSON.parse(userData);
        setZoneName(zone_name?.toUpperCase() || "ZONAL SUB CENTER");
    }
}, []);
  return (
    <div className="receipt-form-container">
      <div className="header">
        <div className="header-content">
          <h4>Receipts Entry for {zoneName}</h4>
          <button className="summary-button" onClick={() => navigate('/report', { state: { from: 'receipts' } })}>
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
      {/* Table */}
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
                {/* Column 1 */}
                <td>{column1[rowIndex] || ""}</td>
                <td>
                  {column1[rowIndex] && (
                    <input
                      type="number"
                      value={formData.amounts[rowIndex]}
                      onChange={(e) => handleChange(rowIndex, e.target.value)}
                      placeholder="0.00"
                    />
                  )}
                </td>

                {/* Column 2 */}
                <td>{column2[rowIndex] || ""}</td>
                <td>
                  {column2[rowIndex] && (
                    <input
                      type="number"
                      value={formData.amounts[columns + rowIndex]}
                      onChange={(e) =>
                        handleChange(columns + rowIndex, e.target.value)
                      }
                      placeholder="0.00"
                    />
                  )}
                </td>

                {/* Column 3 */}
                <td>{column3[rowIndex] || ""}</td>
                <td>
                  {column3[rowIndex] && (
                    <input
                      type="number"
                      value={formData.amounts[columns * 2 + rowIndex]}
                      onChange={(e) =>
                        handleChange(columns * 2 + rowIndex, e.target.value)
                      }
                      placeholder="0.00"
                    />
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="buttons-container">
        <button onClick={clearForm}>Clear</button>
        <button onClick={handleView}>View</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Receipt;
