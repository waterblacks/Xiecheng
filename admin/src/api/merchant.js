const BASE_URL = 'http://localhost:3000/api';

export async function getMyHotels() {
    const token = localStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/merchant/hotels`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.json();
}
