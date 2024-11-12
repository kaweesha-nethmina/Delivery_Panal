import React, { useState } from 'react';
import './OrderHistory.css';

const OrderHistory = () => {
    const orders = [
        {
            id: 'OD294415',
            userEmail: 'ovigalathure@gmail.com',
            product: 'Sea Food Nasigorang',
            quantity: 3,
            price: 1500.0,
            totalPrice: 4500.0,
            timestamp: '11/10/2024, 6:58:14 PM',
            city: 'Colombo',
        },
        {
            id: 'OD243083',
            userEmail: 'th.ja.rangi@gmail.com',
            product: 'Egg & Vegetable Fried Rice',
            quantity: 2,
            price: 650.0,
            totalPrice: 1300.0,
            timestamp: '10/28/2024, 3:57:23 PM',
            city: 'Kandy',
        },
        {
            id: 'OD776996',
            userEmail: 'th.ja.rangi@gmail.com',
            product: 'Egg & Vegetable Fried Rice',
            quantity: 2,
            price: 650.0,
            totalPrice: 1300.0,
            timestamp: '10/28/2024, 3:32:56 PM',
            city: 'Galle',
        },
    ];

    const [selectedOrders, setSelectedOrders] = useState([]);

    const toggleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]); // Deselect all
        } else {
            setSelectedOrders(orders.map(order => order.id)); // Select all
        }
    };

    const toggleSelectOrder = (id) => {
        setSelectedOrders(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(orderId => orderId !== id) // Deselect if already selected
                : [...prevSelected, id] // Select if not already selected
        );
    };

    const isAllSelected = selectedOrders.length === orders.length;

    return (
        <div className="order-history-container">
            <h2>Order History</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th>Order ID</th>
                        <th>User Email</th>
                        <th>Product Name(s)</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Timestamp</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.includes(order.id)}
                                    onChange={() => toggleSelectOrder(order.id)}
                                />
                            </td>
                            <td>{order.id}</td>
                            <td>{order.userEmail}</td>
                            <td>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>{order.price.toFixed(2)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.timestamp}</td>
                            <td>{order.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="send-button"
                onClick={() => alert(`Selected orders sent to admin!`)}
            >
                Send to Admin
            </button>
        </div>
    );
};

export default OrderHistory;
