import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminHome from '../pages/AdminHome';
import MerchantHome from '../pages/MerchantHome';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;
    return children;
}

function IndexRedirect() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) return <Navigate to="/login" />;

    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'merchant') return <Navigate to="/merchant" />;

    return <Navigate to="/login" />;
}

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 根路径根据角色跳转 */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <IndexRedirect />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <AdminHome />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/merchant"
                    element={
                        <PrivateRoute>
                            <MerchantHome />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
