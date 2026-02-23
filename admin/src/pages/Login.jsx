import { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const nav = useNavigate();

    const handleLogin = async () => {
        const res = await login({ username, password });

        if (!res.success) {
            alert(res.message);
            return;
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        nav('/');
    };

    return (
        <div style={{padding: 40}}>
            <h2>后台登录</h2>

            <input
                placeholder="用户名"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

            <br/>

            <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <br/>

            <button onClick={handleLogin}>登录</button>

            <br/>
            <br/>

            <button onClick={() => nav('/register')} style={{backgroundColor: '#f0f0f0'}}>
                还没有账号？去注册
            </button>
        </div>
    );
}
