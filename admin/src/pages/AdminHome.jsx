import { useEffect, useState } from 'react';
import { getAdminOverview } from '../api/admin';

export default function AdminHome() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getAdminOverview().then(res => {
            if (res.success) {
                setData(res.data);
            } else {
                alert(res.message || '获取统计失败');
            }
        });
    }, []);

    if (!data) return <div>加载中...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>管理员首页</h2>

            <ul>
                <li>酒店总数：{data.total_hotels}</li>
                <li>待审核酒店：{data.pending_hotels}</li>
                <li>已通过酒店：{data.approved_hotels}</li>
                <li>已下线酒店：{data.offline_hotels}</li>
                <li>商户总数：{data.total_merchants}</li>
            </ul>
        </div>
    );
}
