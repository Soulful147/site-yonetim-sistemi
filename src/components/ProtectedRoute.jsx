import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles = [] }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const redirectMap = {
            admin: '/admin/dashboard',
            staff: '/staff/dashboard',
            resident: '/resident/dashboard',
        };

        return <Navigate to={redirectMap[user.role] || '/login'} replace />;
    }

    return children;
};

export default ProtectedRoute;
