import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Reports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const Reports = () => {
    const [reportType, setReportType] = useState('daily');
    const [salesChartData, setSalesChartData] = useState(null);
    const [countChartData, setCountChartData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const db = getFirestore();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const confirmedOrdersCollection = collection(db, 'confirmedOrders');
                const deliveryQuery = query(confirmedOrdersCollection, where("deliveryOption", "==", "Delivery"));
                const deliverySnapshot = await getDocs(deliveryQuery);

                const orders = deliverySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const reportData = generateSalesReport(orders, reportType);
                formatChartData(reportData);
                setTableData(formatTableData(orders, reportType));

                const orderCount = orders.length;
                setTotalIncome(orderCount * 300);
            } catch (error) {
                console.error("Error fetching delivery reports:", error);
            }
        };

        fetchReports();
    }, [db, reportType]);

    const generateSalesReport = (orders, period) => {
        const salesData = {};

        orders.forEach(order => {
            if (!order.timestamp?.seconds || !order.totalPrice) return;

            const date = new Date(order.timestamp.seconds * 1000);
            let key;

            if (period === 'daily') {
                key = date.toISOString().split('T')[0];
            } else if (period === 'weekly') {
                const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
                key = startOfWeek.toISOString().split('T')[0];
            } else if (period === 'monthly') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!salesData[key]) {
                salesData[key] = { totalSales: 0, orderCount: 0 };
            }
            salesData[key].totalSales += parseFloat(order.totalPrice);
            salesData[key].orderCount += 1;
        });

        return salesData;
    };

    const formatChartData = (data) => {
        const labels = Object.keys(data);
        const salesValues = labels.map(key => data[key].totalSales);
        const orderCounts = labels.map(key => data[key].orderCount);

        setSalesChartData({
            labels,
            datasets: [
                {
                    label: `Total Sales (Rs) - ${reportType}`,
                    data: salesValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });

        setCountChartData({
            labels,
            datasets: [
                {
                    label: `Order Count - ${reportType}`,
                    data: orderCounts,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    const formatTableData = (orders, period) => {
        return orders.map(order => ({
            orderId: order.id,
            userEmail: order.userEmail || 'N/A',
            totalPrice: `Rs ${order.totalPrice?.toFixed(2)}` || 'N/A',
            timestamp: order.timestamp?.seconds
                ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                : 'N/A'
        }));
    };

    const exportToPDF = async (allReports = false) => {
        const pdf = new jsPDF();
        const types = allReports ? ['daily', 'weekly', 'monthly'] : [reportType];

        for (const type of types) {
            if (allReports) setReportType(type);
            await new Promise(resolve => setTimeout(resolve, 500));

            pdf.setFontSize(16);
            pdf.setTextColor(40);
            pdf.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Delivery Sales Report`, 10, 10);

            pdf.setFontSize(12);
            pdf.text(`Total Delivery Income: Rs ${totalIncome}`, 10, 20);

            const salesChartElement = document.getElementById('sales-chart');
            if (salesChartElement) {
                const canvas = await html2canvas(salesChartElement);
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 10, 30, 180, 80);
            }

            const countChartElement = document.getElementById('count-chart');
            if (countChartElement) {
                const canvas = await html2canvas(countChartElement);
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 10, 120, 180, 80);
            }

            pdf.autoTable({
                startY: 210,
                head: [['Order ID', 'User Email', 'Total Price', 'Timestamp']],
                body: tableData.map(row => [
                    row.orderId,
                    row.userEmail,
                    row.totalPrice,
                    row.timestamp
                ]),
                theme: 'striped',
                headStyles: { fillColor: [75, 192, 192] },
                margin: { top: 10, left: 10, right: 10, bottom: 10 },
                styles: { fontSize: 10, cellPadding: 3 },
                showHead: 'firstPage'
            });

            if (allReports) pdf.addPage();
        }

        pdf.save(allReports ? 'all-reports.pdf' : `${reportType}-report.pdf`);
    };

    return (
        <div className="reports-container">
            <h2>Delivery Reports</h2>

            <div className="controls-container">
                <select
                    className="report-select"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                >
                    <option value="daily">Daily Sales</option>
                    <option value="weekly">Weekly Sales</option>
                    <option value="monthly">Monthly Sales</option>
                </select>

                <div className="button-group">
                    <button className="export-button" onClick={() => exportToPDF()}>
                        Export {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report to PDF
                    </button>
                    <button className="export-button" onClick={() => exportToPDF(true)}>
                        Export All Reports to PDF
                    </button>
                </div>
            </div>

            {/* Only render sales chart if data is available */}
            {salesChartData && (
                <div id="sales-chart" className="chart-container">
                    <Bar
                        data={salesChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: `Total Sales (Rs) - ${reportType}` },
                                datalabels: {
                                    anchor: 'center',
                                    align: 'center',
                                    formatter: (value) => `Rs ${value.toFixed(2)}`,
                                },
                            },
                            scales: {
                                y: {
                                    title: { display: true, text: 'Total Sales (Rs)' },
                                },
                            },
                        }}
                    />
                </div>
            )}

            {/* Only render count chart if data is available */}
            {countChartData && (
                <div id="count-chart" className="chart-container">
                    <Bar
                        data={countChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: `Order Count - ${reportType}` },
                                datalabels: {
                                    anchor: 'center',
                                    align: 'center',
                                    formatter: (value) => `${value}`,
                                },
                            },
                            scales: {
                                y: {
                                    title: { display: true, text: 'Order Count' },
                                    beginAtZero: true,
                                    ticks: { stepSize: 1 },
                                },
                            },
                        }}
                    />
                </div>
            )}

            <div className="total-income">
                <h3>Total Delivery Income: Rs {totalIncome}</h3>
            </div>

            {/* Table */}
            {tableData.length > 0 ? (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User Email</th>
                                <th>Total Price</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.orderId}</td>
                                    <td>{row.userEmail}</td>
                                    <td>{row.totalPrice}</td>
                                    <td>{row.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading table data...</p>
            )}
        </div>
    );
};

export default Reports;
