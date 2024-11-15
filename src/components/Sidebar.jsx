import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from "../assets/logo.jpg";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="logo-section">
                <img src={logo} alt="Logo" className="logo" />
                <h2>Biriyani Kade</h2>
                <p>biryanikade@gmail.com</p>
            </div>
            <h3>Deliver Panel</h3>
            <ul>
                <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Dashboard</li>
                </NavLink>
                <NavLink to="/dashboard/new-orders" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>New Orders</li>
                </NavLink>
                <NavLink to="/dashboard/confirm-orders" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Processing Orders</li>
                </NavLink>
                <NavLink to="/dashboard/order-history" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Order History</li>
                </NavLink>
                <NavLink to="/dashboard/reports" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Reports</li>
                </NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    <li>Profile</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Sidebar;
