import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Ensure the path is correct
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './NewOrders.css';

const NewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveryOrders = async () => {
            try {
                const deliveryCollection = collection(db, 'delivery');
                const deliverySnapshot = await getDocs(deliveryCollection);
                const deliveryOrders = deliverySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(deliveryOrders);
            } catch (error) {
                console.error('Error fetching delivery orders:', error);
            }
        };

        fetchDeliveryOrders();
    }, []);

    const formatPrice = (price) => {
        return !isNaN(price) ? parseFloat(price).toFixed(2) : 'N/A';
    };

    const toggleSelectOrder = (orderId) => {
        setSelectedOrders(prevSelectedOrders =>
            prevSelectedOrders.includes(orderId)
                ? prevSelectedOrders.filter(id => id !== orderId)
                : [...prevSelectedOrders, orderId]
        );
    };

    const deleteOrderFromDelivery = async (orderId) => {
        const q = query(collection(db, 'delivery'), where("id", "==", orderId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = doc(db, 'delivery', querySnapshot.docs[0].id);
            await deleteDoc(docRef);
            setOrders(prevOrders => prevOrders.filter(order => order.id !== docRef.id));
        } else {
            console.log("No order found with the specified orderId");
        }
    };

    const handlePickupSelectedOrders = async () => {
        try {
            const ordersToProcess = selectedOrders.map(async (orderId) => {
                const orderToMove = orders.find(order => order.id === orderId);
                if (orderToMove) {
                    // Add order to pickupOrders
                    await addDoc(collection(db, 'pickupOrders'), {
                        ...orderToMove,
                        status: 'Picked Up',
                    });

                    // Delete order from delivery collection
                    await deleteOrderFromDelivery(orderId);
                }
            });
            await Promise.all(ordersToProcess); // Wait for all operations to complete
            setSelectedOrders([]); // Clear selected orders after pickup

            // Navigate to /dashboard/confirm-orders
            navigate('/dashboard/confirm-orders');
        } catch (error) {
            console.error('Error moving selected orders to pickupOrders:', error);
        }
    };

    return (
        <div className="new-orders-container">
            <h2>New Orders</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={() => {
                                    setSelectedOrders(
                                        selectedOrders.length === orders.length ? [] : orders.map(order => order.id)
                                    );
                                }}
                                checked={selectedOrders.length === orders.length && orders.length > 0}
                            />
                        </th>
                        <th>Order ID</th>
                        <th>User Email</th>
                        <th>Product Name(s)</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Address</th> {/* New Address column */}
                        <th>Delivery Option</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
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
                                <td>{order.items.map(item => item.productName).join(', ')}</td>
                                <td>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                                <td>{order.items.map(item => formatPrice(item.price)).join(', ')}</td>
                                <td>{order.totalPrice ? formatPrice(order.totalPrice) : 'N/A'}</td>
                                <td>{order.address || 'N/A'}</td> {/* Display address here */}
                                <td>{order.deliveryOption || 'N/A'}</td>
                                <td>
                                    {order.timestamp ? (
                                        <>
                                            {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}{' '}
                                            {new Date(order.timestamp.seconds * 1000).toLocaleTimeString()}
                                        </>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No new orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button
                className="pickup-button"
                onClick={handlePickupSelectedOrders}
                disabled={selectedOrders.length === 0}
            >
                Noted
            </button>
        </div>
    );
};

export default NewOrders;
