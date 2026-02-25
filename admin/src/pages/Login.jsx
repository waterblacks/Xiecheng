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

        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data.user));

        // 根据用户角色跳转到对应页面
        const user = res.data.user;
        if (user.role === 'admin') {
            nav('/admin'); // 跳转到管理员主页面
        } else if (user.role === 'merchant') {
            nav('/merchant'); // 跳转到商户页面
        } else {
            nav('/login');
        }
    };

    return (
        <div style={{padding: 40}}>
            <h2>后台登录</h2>

            <input
                placeholder="用户名"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                    padding: '10px',
                    margin: '10px 0',
                    width: '300px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px'
                }}
            />

            <br/>

            <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                    padding: '10px',
                    margin: '10px 0',
                    width: '300px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px'
                }}
            />

            <br/>

            <button 
                onClick={handleLogin}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    marginRight: '10px'
                }}
            >
                登录
            </button>
            
            <button 
                onClick={() => nav('/register')}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#52c41a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                注册新用户
            </button>
            
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p>提示：注册时可以选择注册为管理员或商户角色</p>
            </div>
        </div>
    );
}
