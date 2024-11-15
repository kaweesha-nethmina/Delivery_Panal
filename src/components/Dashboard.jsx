import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Dashboard.css';

const Dashboard = () => {
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
    const [pastOrdersCount, setPastOrdersCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const db = getFirestore();

    const isDashboardRoot = location.pathname === "/dashboard"; // Updated path check

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetch new orders count
                const newOrdersCollection = collection(db, 'delivery');
                const newOrdersSnapshot = await getDocs(newOrdersCollection);
                setNewOrdersCount(newOrdersSnapshot.size);

                // Fetch delivered orders count
                const confirmedOrdersCollection = collection(db, 'confirmedOrders');
                const deliveredOrdersQuery = query(confirmedOrdersCollection, where("status", "==", "Delivered"));
                const deliveredOrdersSnapshot = await getDocs(deliveredOrdersQuery);
                setDeliveredOrdersCount(deliveredOrdersSnapshot.size);

                // Fetch past orders count (assuming all confirmed orders are past orders)
                const pastOrdersSnapshot = await getDocs(confirmedOrdersCollection);
                setPastOrdersCount(pastOrdersSnapshot.size);
            } catch (error) {
                console.error("Error fetching order counts:", error);
            }
        };

        fetchCounts();
    }, [db]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Topbar />
                <div className="content">
                    {isDashboardRoot ? (
                        // Default content for the Dashboard path
                        <div className="dashboard-cards">
                            <div
                                className="box new-order"
                                onClick={() => handleNavigation('/dashboard/new-orders')}
                            >
                                New Orders <span className="notification-icon">🔔</span><br />
                                <span className="order-count">{newOrdersCount}</span>
                            </div>
                            <div
                                className="box delivered-orders"
                                onClick={() => handleNavigation('/dashboard/confirm-orders')}
                            >
                                Delivered Orders <span className="notification-icon">🔔</span><br />
                                <span className="order-count">{deliveredOrdersCount}</span>
                            </div>
                            <div
                                className="box past-orders"
                                onClick={() => handleNavigation('/dashboard/order-history')}
                            >
                                Past Orders <span className="notification-icon">🔔</span><br />
                                <span className="order-count">{pastOrdersCount}</span>
                            </div>
                        </div>
                    ) : (
                        // Render child components for other paths
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
