// Reports.jsx
import React from 'react';
import './Reports.css';

const Reports = () => {
    const reports = [
        { id: 1, name: 'Monthly Sales', date: '2023-10-01' },
        { id: 2, name: 'Customer Feedback', date: '2023-10-15' },
        { id: 3, name: 'Inventory Overview', date: '2023-11-01' },
        // Add more reports as needed
    ];

    return (
        <div className="reports-container">
            <h2>Reports</h2>
            <table className="reports-table">
                <thead>
                    <tr>
                        <th>Report ID</th>
                        <th>Report Name</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td>{report.id}</td>
                            <td>{report.name}</td>
                            <td>{report.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="generate-report-button">Generate Report</button>
        </div>
    );
};

export default Reports;
