import React from "react";
import "../App.css";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import "chart.js/auto";

const HomePage = () => {
  const [zoneName, setZoneName] = useState("");

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const { zone_name } = JSON.parse(userData);
      setZoneName(zone_name?.toUpperCase() || "ZONAL SUB CENTER");
    }
  }, []);
  const chartData = {
    labels: ["PM", "APM", "FPM"],
    datasets: [
      {
        label: "Admissions",
        data: [1600, 1600, 0], // Adjust the data here
        backgroundColor: ["#007bff", "#dc3545", "#28a745"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
      <h2>{zoneName}</h2>
      </header>

      {/* Main Content */}
      <div className="content">
        {/* Admissions Section */}
        <div className="card admissions">
          <h2>ADMISSIONS</h2>
          <table>
            <thead>
              <tr>
                <th>PM</th>
                <th>APM</th>
                <th>FPM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>16000</td>
                <td>16000</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chart Section */}
        <div className="card chart">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Bank Section */}
        <div className="card bank">
          <h2>Bank</h2>
          <table>
            <thead>
              <tr>
                <th>1 April</th>
                <th>Current</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
