import React, { useState } from "react";
import "./Receipt.css";
import { createPayment } from '../services/api'; 

const Receipt = () => {
  const ledgerNames = [
    "Adm.fees",
    "PM",
    "APM",
    "FPPM",
    "Samvad Donation",
    "Legal Fund",
    "Misc.Donation",
    "DRF",
    "Advertisement Samvad",
    "Interest on S.B.",
    "Interest on F.D.",
    "Investments",
    "Guest House Receipt",
    "Building Fund",
    "Sundry Receipt",
    "Dividend",
    "Tds",
    "Tr. from H.Q.",
    "Suspense",
    "Total Amount paid",
  ];

  // Dividing ledger names into three equal parts
  const columns = Math.ceil(ledgerNames.length / 3);
  const column1 = ledgerNames.slice(0, columns);
  const column2 = ledgerNames.slice(columns, columns * 2);
  const column3 = ledgerNames.slice(columns * 2);

  const [formData, setFormData] = useState({
    amounts: Array(ledgerNames.length).fill(""),
  });

  const handleChange = (index, value) => {
    const updatedAmounts = [...formData.amounts];
    updatedAmounts[index] = value;
    setFormData({ ...formData, amounts: updatedAmounts });
  };

  const clearForm = () => {
    setFormData({ amounts: Array(ledgerNames.length).fill("") });
  };

  const handleSubmit = async () => {
    try {
        // Calculate total before submitting
        const total = formData.amounts
            .slice(0, -1) // Exclude the last element (total)
            .reduce((sum, amount) => sum + (Number(amount) || 0), 0);
        
        // Update the total in the form data
        const updatedAmounts = [...formData.amounts];
        updatedAmounts[19] = total.toString(); // Update total amount

        const response = await createPayment({
            amounts: updatedAmounts
        });
        
        console.log('Payment created:', response);
        alert('Payment submitted successfully!');
        clearForm(); // Clear the form after successful submission
    } catch (error) {
        console.error('Error submitting payment:', error);
        alert('Error submitting payment. Please try again.');
    }
};

  const handleDelete = () => {
    alert("Delete Functionality Here!");
  };

  const handleView = () => {
    console.log("View Data:", formData);
    alert("View Functionality Here!");
  };

  return (
    <div className="receipt-form-container">
      {/* Header */}
      <div className="header">
        <h3>Receipts Entry Form</h3>
      </div>

      {/* Form Inputs */}
      <div className="form-inputs">
        <label>
          Date:
          <input
            type="date"
            onChange={(e) => console.log(e.target.value)}
          />
        </label>
        <label>
          CHQ No.:
          <input
            type="text"
            onChange={(e) => console.log(e.target.value)}
          />
        </label>
        <label>
          Voucher No.:
          <input
            type="text"
            onChange={(e) => console.log(e.target.value)}
          />
        </label>
        <label>
          Particulars:
          <input
            type="text"
            onChange={(e) => console.log(e.target.value)}
          />
        </label>
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
