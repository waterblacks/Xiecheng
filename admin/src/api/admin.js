const BASE_URL = 'http://localhost:3000/api';

export async function getAdminOverview() {
    const token = sessionStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/admin/stats/overview`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.json();
}
