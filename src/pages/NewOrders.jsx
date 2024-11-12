import React, { useState } from 'react';
import './NewOrders.css';

const NewOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = [
        {
            id: 'OD294415',
            userEmail: 'ovigalathure@gmail.com',
            product: 'Sea Food Nasigorang',
            quantity: 3,
            price: 1500.0,
            totalPrice: 4500.0,
            timestamp: '11/10/2024, 6:58:14 PM',
        },
        {
            id: 'OD243083',
            userEmail: 'th.ja.rangi@gmail.com',
            product: 'Egg & Vegetable Fried Rice',
            quantity: 2,
            price: 650.0,
            totalPrice: 1300.0,
            timestamp: '10/28/2024, 3:57:23 PM',
        },
        {
            id: 'OD776996',
            userEmail: 'th.ja.rangi@gmail.com',
            product: 'Egg & Vegetable Fried Rice',
            quantity: 2,
            price: 650.0,
            totalPrice: 1300.0,
            timestamp: '10/28/2024, 3:32:56 PM',
        },
        // Add more orders as needed
    ];

    const openModal = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="new-orders-container">
            <h2>New Orders</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User Email</th>
                        <th>Product Name(s)</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} onClick={() => openModal(order)}>
                            <td>{order.id}</td>
                            <td>{order.userEmail}</td>
                            <td>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>{order.price.toFixed(2)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                        <p><strong>User Email:</strong> {selectedOrder.userEmail}</p>
                        <p><strong>Product:</strong> {selectedOrder.product}</p>
                        <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                        <p><strong>Price:</strong> {selectedOrder.price.toFixed(2)}</p>
                        <p><strong>Total Price:</strong> {selectedOrder.totalPrice.toFixed(2)}</p>
                        <p><strong>Timestamp:</strong> {selectedOrder.timestamp}</p>
                        <button className="picked-up-button" onClick={closeModal}>Picked Up</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewOrders;
