import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine the title based on the current path
    const getTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/dashboard/new-orders':
                return 'New Orders';
            case '/dashboard/confirm-orders':
                return 'Confirm Orders';
            case '/dashboard/order-history':
                return 'Order History';
            case '/dashboard/reports':
                return 'Reports';
            case '/dashboard/profile':
                return 'Profile';
            default:
                return 'Dashboard';
        }
    };

    const handleLogout = () => {
        alert('Logged out');
        navigate('/'); // Redirect to the login page (or home) after the alert
    };

    return (
        <div className="topbar">
            <h1>{getTitle()}</h1>
            <div className="topbar-right">
                <span>Welcome, Ovini</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Topbar;
