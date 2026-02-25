import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ padding: 40, maxWidth: 360 }}>

            <h2>注册账号</h2>

            <div>
                <input
                    placeholder="用户名"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>

            <br />

            <div>
                <input
                    type="password"
                    placeholder="密码（不少于6位）"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <br />

            <div>
                <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                >
                    <option value="merchant">商户</option>
                    <option value="admin">管理员</option>
                </select>
            </div>

            <br />

            <button
                onClick={handleRegister}
                disabled={loading}
            >
                {loading ? '注册中...' : '注册'}
            </button>

        </div>
    );
}