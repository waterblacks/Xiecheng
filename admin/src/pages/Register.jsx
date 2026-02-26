import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // 引入分离出来的 CSS 文件

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('merchant');
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    const handleRegister = async () => {
        const u = username.trim();
        const p = password.trim();

        if (!u) {
            alert('请输入用户名');
            return;
        }

        if (!p) {
            alert('请输入密码');
            return;
        }

        if (p.length < 6) {
            alert('密码长度不能少于 6 位');
            return;
        }

        try {
            setLoading(true);

            const res = await register({
                username: u,
                password: p,
                role
            });

            if (!res.success) {
                alert(res.message || '注册失败');
                return;
            }

            alert('注册成功，请登录');
            nav('/login');

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                {/* 装饰性背景圆 */}
                <div className="decorative-circle"></div>

                <div className="register-content">
                    {/* Logo/图标 */}
                    <div className="logo-wrapper">
                        <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>

                    {/* 标题 */}
                    <h2 className="register-title">
                        注册账号
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
                        />
                    </div>

                    {/* 密码输入框 */}
                    <div className="form-group form-group-password">
                        <label className="form-label">密码（不少于6位）</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="请输入密码"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {/* 角色选择 */}
                    <div className="form-group">
                        <label className="form-label">角色</label>
                        <select
                            className="form-input"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="merchant">商户</option>
                            <option value="admin">管理员</option>
                        </select>
                    </div>

                    {/* 注册按钮 */}
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="btn-register"
                    >
                        {loading ? '注册中...' : '注册'}
                    </button>

                    {/* 返回登录链接 */}
                    <button
                        onClick={() => nav('/login')}
                        className="btn-login-link"
                    >
                        已有账号？去登录
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
