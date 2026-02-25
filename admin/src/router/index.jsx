import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminHome from '../pages/AdminHome';
import MerchantHome from '../pages/MerchantHome';

// 修改：强制跳转到登录页面的组件
function ForceLoginRedirect() {
    // 清除所有认证信息
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
}

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
                
                {/* 修改：根路径强制跳转到登录页面 */}
                <Route path="/" element={<ForceLoginRedirect />} />
                
                {/* 管理员路由 */}
                <Route 
                    path="/admin" 
                    element={
                        <PrivateRoute>
                            <AdminHome />
                        </PrivateRoute>
                    } 
                />
                
                {/* 商户路由 */}
                <Route 
                    path="/merchant" 
                    element={
                        <PrivateRoute>
                            <MerchantHome />
                        </PrivateRoute>
                    } 
                />
                
                {/* 保持原有的隐藏管理路径用于测试 */}
                <Route 
                    path="/admin-panel" 
                    element={
                        <PrivateRoute>
                            <AdminHome />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/merchant-panel" 
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
