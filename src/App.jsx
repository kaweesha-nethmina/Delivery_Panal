import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NewOrders from './pages/NewOrders';
import ConfirmOrders from './pages/ConfirmOrders';
import OrderHistory from './pages/OrderHistory';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />}>
                        {/* Child routes for different sections */}
                        <Route path="new-orders" element={<NewOrders />} />
                        <Route path="confirm-orders" element={<ConfirmOrders />} />
                        <Route path="order-history" element={<OrderHistory />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
