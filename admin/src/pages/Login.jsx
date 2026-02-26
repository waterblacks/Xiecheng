import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }

        setLoading(true);
        try {
            const res = await login({ username, password });

            if (!res.success) {
                alert(res.message);
                return;
            }

            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));

            // 根据用户角色跳转到对应页面
            const user = res.data.user;
            if (user.role === 'admin') {
                nav('/admin');
            } else if (user.role === 'merchant') {
                nav('/merchant');
            } else {
                nav('/login');
            }
        } catch (error) {
            alert('登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* 装饰性背景圆 */}
                <div className="decorative-circle"></div>

                <div className="login-content">
                    {/* Logo/图标 */}
                    <div className="logo-wrapper">
                        <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>

                    {/* 标题 */}
                    <h2 className="login-title">
                        酒店后台管理系统
                    </h2>

                    {/* 用户名输入框 */}
                    <div className="form-group">
                        <label className="form-label">用户名</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="请输入用户名"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {/* 密码输入框 */}
                    <div className="form-group form-group-password">
                        <label className="form-label">密码</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="请输入密码"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    {/* 登录按钮 */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="btn-login"
                    >
                        {loading ? '登录中...' : '登 录'}
                    </button>

                    {/* 注册按钮 */}
                    <button
                        onClick={() => nav('/register')}
                        className="btn-register"
                    >
                        注册新用户
                    </button>

                    {/* 提示信息 */}
                    <div className="hint-box">
                        <div className="hint-title">💡 温馨提示</div>
                        注册时可以选择注册为管理员或商户角色
                    </div>
                </div>
            </div>
        </div>
    );
}
