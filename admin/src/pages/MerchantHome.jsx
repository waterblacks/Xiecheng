import { useEffect, useState } from 'react';
import { getMyHotels } from '../api/merchant';

export default function MerchantHome() {
    const [list, setList] = useState([]);

    useEffect(() => {
        getMyHotels().then(res => {
            if (res.success) {
                setList(res.data);
            } else {
                alert(res.message || '获取酒店失败');
            }
        });
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>商户首页（我的酒店）</h2>

            <table border="1" cellPadding="6">
                <thead>
                <tr>
                    <th>酒店名</th>
                    <th>状态</th>
                    <th>房间数</th>
                    <th>最低价</th>
                    <th>创建时间</th>
                </tr>
                </thead>
                <tbody>
                {list.map(item => (
                    <tr key={item.id}>
                        <td>{item.name_cn}</td>
                        <td>{item.status}</td>
                        <td>{item.room_count}</td>
                        <td>{item.min_price}</td>
                        <td>{item.created_at}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
