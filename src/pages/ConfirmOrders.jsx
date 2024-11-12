import React, { useState } from 'react';
import './ConfirmOrders.css';

const ConfirmOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const orders = [
        {
            id: 'OD294415',
            userEmail: 'ovigalathure@gmail.com',
            product: 'Sea Food Nasigorang',
            quantity: 3,
            price: 1500.0,
            totalPrice: 4500.0,
            timestamp: '11/10/2024, 6:58:14 PM',
            city: 'Colombo'
        },
        {
            id: 'OD243083',
            userEmail: 'th.ja.rangi@gmail.com',
            product: 'Egg & Vegetable Fried Rice',
            quantity: 2,
            price: 650.0,
            totalPrice: 1300.0,
            timestamp: '10/28/2024, 3:57:23 PM',
            city: 'Kandy'
        },
        {
            id: 'OD776996',
            userEmail: 'th.ja.rangi@gmail.com',
            product: 'Egg & Vegetable Fried Rice',
            quantity: 2,
            price: 650.0,
            totalPrice: 1300.0,
            timestamp: '10/28/2024, 3:32:56 PM',
            city: 'Galle'
        },
        // Add more orders as needed
    ];

    const openModal = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setSelectedFile(null); // Reset file selection when modal is closed
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div className="confirm-orders-container">
            <h2>Confirm Orders</h2>
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
                        <th>City</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="clickable-row" onClick={() => openModal(order)}>
                            <td>{order.id}</td>
                            <td>{order.userEmail}</td>
                            <td>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>{order.price.toFixed(2)}</td>
                            <td>{order.totalPrice.toFixed(2)}</td>
                            <td>{order.timestamp}</td>
                            <td>{order.city}</td>
                            <td>
                                <button className="approve-button" onClick={(e) => { e.stopPropagation(); alert('Marked as Delivered'); }}>Delivered</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Order Details</h3>
                        <p><strong>Deliver Man ID:</strong> [Enter ID]</p>
                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                        <div className="file-input-container">
                            <label htmlFor="fileInput"><strong>Confirmed Document:</strong></label>
                            <input 
                                type="file" 
                                id="fileInput" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                            {selectedFile && (
                                <p className="file-name">Selected File: {selectedFile.name}</p>
                            )}
                        </div>
                        <button className="submit-button" onClick={closeModal}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmOrders;
