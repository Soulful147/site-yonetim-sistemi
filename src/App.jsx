import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange } from './services/authService';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/common/Loader';

// Auth Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

// Resident Pages
import ResidentDashboard from './pages/resident/Dashboard';
import CreateTicket from './pages/resident/CreateTicket';
import MyTickets from './pages/resident/MyTickets';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AllTickets from './pages/admin/AllTickets';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';

import './index.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {user && <Navbar user={user} />}

                <div style={{ display: 'flex', flex: 1 }}>
                    {user && <Sidebar role={user.role} />}

                    <main style={{
                        flex: 1,
                        padding: 'var(--spacing-xl)',
                        maxWidth: user ? 'calc(100% - 250px)' : '100%',
                    }}>
                        <Routes>
                            {/* Public Routes */}
                            <Route
                                path="/login"
                                element={user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />}
                            />
                            <Route path="/forgot-password" element={<ForgotPassword />} />

                            {/* Resident Routes */}
                            <Route
                                path="/resident/dashboard"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['resident']}>
                                        <ResidentDashboard user={user} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/resident/create"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['resident']}>
                                        <CreateTicket user={user} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/resident/tickets"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['resident']}>
                                        <MyTickets user={user} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/tickets"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['admin']}>
                                        <AllTickets />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/analytics"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['admin']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Staff Routes */}
                            <Route
                                path="/staff/dashboard"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['staff']}>
                                        <StaffDashboard user={user} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/staff/tasks"
                                element={
                                    <ProtectedRoute user={user} allowedRoles={['staff']}>
                                        <StaffDashboard user={user} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Default Route */}
                            <Route
                                path="/"
                                element={
                                    user ? (
                                        <Navigate
                                            to={
                                                user.role === 'admin'
                                                    ? '/admin/dashboard'
                                                    : user.role === 'staff'
                                                        ? '/staff/dashboard'
                                                        : '/resident/dashboard'
                                            }
                                            replace
                                        />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                }
                            />

                            {/* 404 */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
