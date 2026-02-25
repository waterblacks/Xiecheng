const BASE_URL = 'http://localhost:3000/api';

export async function login(data) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    return res.json();
}

export async function register(data) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    return res.json();
}

export async function getProfile() {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/auth/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.json();
}
