import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Ensure the path is correct
import { collection, getDocs } from 'firebase/firestore';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchConfirmedOrders = async () => {
            try {
                const confirmedOrdersCollection = collection(db, 'confirmedOrders');
                const snapshot = await getDocs(confirmedOrdersCollection);
                const confirmedOrders = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter(order => order.deliveryOption === 'Delivery'); // Filter by deliveryOption
                setOrders(confirmedOrders);
            } catch (error) {
                console.error('Error fetching confirmed orders:', error);
            }
        };

        fetchConfirmedOrders();
    }, []);

    const formatPrice = (price) => {
        return price !== undefined && price !== null ? parseFloat(price).toFixed(2) : 'N/A';
    };

    return (
        <div className="order-history-container">
            <h2>Order History</h2>
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
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.userEmail}</td>
                            <td>{order.product || order.items?.map(item => item.productName).join(', ')}</td>
                            <td>{order.quantity || order.items?.reduce((total, item) => total + item.quantity, 0)}</td>
                            <td>{formatPrice(order.price || order.items?.[0]?.price)}</td>
                            <td>{order.totalPrice ? formatPrice(order.totalPrice) : 'N/A'}</td>
                            <td>
                                {order.timestamp?.seconds
                                    ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                                    : 'N/A'}
                            </td>
                            <td>{order.address || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;
