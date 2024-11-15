import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Ensure the path is correct
import { collection, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import './ConfirmOrders.css';

const ConfirmOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch orders from the pickupOrders collection
    useEffect(() => {
        const fetchPickupOrders = async () => {
            try {
                const pickupOrdersCollection = collection(db, 'pickupOrders');
                const snapshot = await getDocs(pickupOrdersCollection);
                const pickupOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(pickupOrders);
            } catch (error) {
                console.error("Error fetching pickup orders:", error);
            }
        };

        fetchPickupOrders();
    }, []);

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

    const deleteOrderFromPickupOrders = async (orderId) => {
        const q = query(collection(db, 'pickupOrders'), where("id", "==", orderId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await deleteDoc(docRef);
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } else {
            console.log("No order found with the specified orderId in pickupOrders");
        }
    };

    const markAsDelivered = async (order) => {
        try {
            // Add the order to confirmedOrders collection
            await addDoc(collection(db, 'confirmedOrders'), {
                ...order,
                status: 'Delivered'
            });

            // Delete the order from pickupOrders collection
            await deleteOrderFromPickupOrders(order.id);

            // Show an alert to confirm
            alert('Order marked as delivered');
        } catch (error) {
            console.error("Error marking order as delivered:", error);
            alert('Failed to mark order as delivered');
        }
    };

    return (
        <div className="confirm-orders-container">
            
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="clickable-row" onClick={() => openModal(order)}>
                            <td>{order.id}</td>
                            <td>{order.userEmail}</td>
                            <td>{order.product || order.items.map(item => item.productName).join(', ')}</td>
                            <td>{order.quantity || order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                            <td>{order.price ? order.price.toFixed(2) : order.items.map(item => item.price).join(', ')}</td>
                            <td>{order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</td>
                            <td>
                                {order.timestamp && order.timestamp.seconds
                                    ? new Date(order.timestamp.seconds * 1000).toLocaleString()
                                    : 'N/A'}
                            </td>
                            <td>{order.address || 'N/A'}</td>
                            <td>
                                <button
                                    className="approve-button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent opening the modal
                                        markAsDelivered(order);
                                    }}
                                >
                                    Delivered
                                </button>
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
                        <p><strong>Address:</strong> {selectedOrder.address || 'N/A'}</p>
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
