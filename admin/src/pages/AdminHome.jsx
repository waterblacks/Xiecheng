import { useEffect, useState } from 'react';

const BASE = 'http://localhost:3000/api';

export default function AdminHotelReview() {

    const [list, setList] = useState([]);
    const token = localStorage.getItem('token');

    const load = async () => {
        const res = await fetch(`${BASE}/admin/hotels`, {
            headers:{ Authorization:`Bearer ${token}` }
        });

        const data = await res.json();
        if (data.success) setList(data.data);
    };

    useEffect(() => { load(); }, []);

    const call = async (url) => {
        await fetch(url, {
            method:'PUT',
            headers:{ Authorization:`Bearer ${token}` }
        });
        load();
    };

    return (
        <div style={{ padding:20 }}>
            <h2>酒店审核 / 上下线管理</h2>

            <table border="1" cellPadding="6">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>酒店名</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody>
                {list.map(h => (
                    <tr key={h.id}>
                        <td>{h.id}</td>
                        <td>{h.name_cn}</td>
                        <td>{h.status}</td>
                        <td>

                            {h.status === 'pending' && (
                                <>
                                    <button
                                        onClick={()=>call(`${BASE}/admin/hotels/${h.id}/approve`)}
                                    >
                                        通过
                                    </button>

                                    <button
                                        onClick={()=>call(`${BASE}/admin/hotels/${h.id}/reject`)}
                                        style={{marginLeft:6}}
                                    >
                                        不通过
                                    </button>
                                </>
                            )}

                            {h.status === 'approved' && (
                                <button
                                    onClick={()=>call(`${BASE}/admin/hotels/${h.id}/offline`)}
                                >
                                    下线
                                </button>
                            )}

                            {h.status === 'offline' && (
                                <button
                                    onClick={()=>call(`${BASE}/admin/hotels/${h.id}/online`)}
                                >
                                    恢复上线
                                </button>
                            )}

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}