import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('merchant');

    const nav = useNavigate();

    const handleRegister = async () => {
        const res = await register({ username, password, role });

        if (!res.success) {
            alert(res.message);
            return;
        }

        alert('注册成功');
        nav('/login');
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>注册账号</h2>

            <input
                placeholder="用户名"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

            <br />

            <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <br />

            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="merchant">商户</option>
                <option value="admin">管理员</option>
            </select>

            <br />

            <button onClick={handleRegister}>注册</button>
        </div>
    );
}
