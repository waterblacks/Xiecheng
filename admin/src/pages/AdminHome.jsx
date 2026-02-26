import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css'; // 引入分离出来的 CSS 文件

const BASE = 'http://localhost:3000/api';

/* ================= 酒店审核页面 ================= */

function HotelReviewPage() {
    const [pendingList, setPendingList] = useState([]);
    const token = sessionStorage.getItem('token');

    // 新增状态：用于控制拒绝弹窗
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [currentHotelId, setCurrentHotelId] = useState(null);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [customReason, setCustomReason] = useState('');

    // 预设的拒绝原因选项
    const rejectOptions = [
        '信息填写不完整',
        '图片质量不合格',
        '地址信息有误',
        '价格设置不合理',
        '涉嫌虚假宣传'
    ];

    const load = async () => {
        const res = await fetch(`${BASE}/admin/hotels?status=pending`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setPendingList(data.data);
    };

    const handleApprove = async (id) => {
        await fetch(`${BASE}/admin/hotels/${id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        load();
    };

    // 打开拒绝弹窗
    const openRejectModal = (id) => {
        setCurrentHotelId(id);
        setSelectedReasons([]);
        setCustomReason('');
        setShowRejectModal(true);
    };

    // 处理多选框变化
    const handleReasonChange = (reason) => {
        if (selectedReasons.includes(reason)) {
            setSelectedReasons(selectedReasons.filter(r => r !== reason));
        } else {
            setSelectedReasons([...selectedReasons, reason]);
        }
    };

    // 提交拒绝原因
    const submitReject = async () => {
        // 合并多选原因和自定义原因
        const allReasons = [...selectedReasons];
        if (customReason.trim()) {
            allReasons.push(customReason.trim());
        }

        if (allReasons.length === 0) {
            alert('请选择或输入拒绝原因');
            return;
        }

        const reasonText = allReasons.join('；');

        await fetch(`${BASE}/admin/hotels/${currentHotelId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ reason: reasonText })
        });

        setShowRejectModal(false);
        load();
    };

    useEffect(() => {
        document.title = '管理中心 - 酒店管理系统';
        load();
    }, []);

    return (
        <div className="content-area">
            <h2 className="page-title">酒店审核</h2>

            {pendingList.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div className="empty-text">暂无待审核酒店</div>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>商户id</th>
                            <th>酒店名</th>
                            <th>地址</th>
                            <th>星级</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingList.map(h => (
                            <tr key={h.id}>
                                <td>{h.id}</td>
                                <td>{h.merchantId}</td>
                                <td>{h.name_cn}</td>
                                <td>{h.address}</td>
                                <td>{'★'.repeat(h.star_rating || 0)}</td>
                                <td>
                                    <button
                                        className="action-btn approve-btn"
                                        onClick={() => handleApprove(h.id)}
                                    >
                                        通过
                                    </button>
                                    <button
                                        className="action-btn reject-btn"
                                        onClick={() => openRejectModal(h.id)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        不通过
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ 拒绝原因弹窗 */}
            {showRejectModal && (
                <div className="reject-modal">
                    <div className="modal-content">
                        <h3 className="modal-title">请选择/输入拒绝原因</h3>

                        <div className="reason-options">
                            {rejectOptions.map(opt => (
                                <div key={opt} className="reason-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedReasons.includes(opt)}
                                        onChange={() => handleReasonChange(opt)}
                                    />
                                    <span style={{ marginLeft: 8 }}>{opt}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ margin: '15px 0' }}>
                            <div style={{ marginBottom: 5 }}>其他原因：</div>
                            <textarea
                                className="form-textarea"
                                placeholder="请输入其他原因..."
                                value={customReason}
                                onChange={e => setCustomReason(e.target.value)}
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="modal-btn cancel-btn"
                            >
                                取消
                            </button>
                            <button
                                onClick={submitReject}
                                className="modal-btn confirm-btn"
                            >
                                确认拒绝
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= 上下线管理页面 ================= */

function OnlineOfflineManagementPage() {
    const [publishedList, setPublishedList] = useState([]);
    const [offlineList, setOfflineList] = useState([]);
    const token = sessionStorage.getItem('token');

    const loadPublished = async () => {
        const res = await fetch(`${BASE}/admin/hotels?status=approved`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setPublishedList(data.data);
    };

    const loadOffline = async () => {
        const res = await fetch(`${BASE}/admin/hotels?status=offline`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setOfflineList(data.data);
    };

    const handleOffline = async (id) => {
        await fetch(`${BASE}/admin/hotels/${id}/offline`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        loadPublished();
        loadOffline();
    };

    const handleOnline = async (id) => {
        await fetch(`${BASE}/admin/hotels/${id}/online`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        loadPublished();
        loadOffline();
    };

    useEffect(() => {
        loadPublished();
        loadOffline();
    }, []);

    return (
        <div className="content-area">
            <h2 className="page-title">上下线管理</h2>

            <h3 className="section-title">已发布酒店</h3>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>酒店名</th>
                        <th>地址</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {publishedList.map(h => (
                        <tr key={h.id}>
                            <td>{h.id}</td>
                            <td>{h.name_cn}</td>
                            <td>{h.address}</td>
                            <td>
                                <button
                                    className="action-btn offline-btn"
                                    onClick={() => handleOffline(h.id)}
                                >
                                    下线
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <h3 className="section-title" style={{ marginTop: 30 }}>已下线酒店</h3>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>酒店名</th>
                        <th>地址</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {offlineList.map(h => (
                        <tr key={h.id}>
                            <td>{h.id}</td>
                            <td>{h.name_cn}</td>
                            <td>{h.address}</td>
                            <td>
                                <button
                                    className="action-btn online-btn"
                                    onClick={() => handleOnline(h.id)}
                                >
                                    恢复上线
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ================= 已发布酒店 ================= */

function PublishedHotelsPage() {
    const [list, setList] = useState([]);
    const token = sessionStorage.getItem('token');

    const load = async () => {
        const res = await fetch(`${BASE}/admin/hotels?status=approved`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setList(data.data);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="content-area">
            <h2 className="page-title">已发布酒店</h2>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>酒店名</th>
                        <th>地址</th>
                        <th>星级</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map(h => (
                        <tr key={h.id}>
                            <td>{h.id}</td>
                            <td>{h.name_cn}</td>
                            <td>{h.address}</td>
                            <td>{'★'.repeat(h.star_rating || 0)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ================= 顶部导航 ================= */

function AdminNavbar({ activeTab, onTabChange, onLogout }) {
    const items = [
        { key: 'review', label: '酒店审核' },
        { key: 'online-offline', label: '上下线管理' },
        { key: 'published', label: '已发布酒店' }
    ];

    return (
        <div className="admin-navbar">
            {items.map(i => (
                <span
                    key={i.key}
                    onClick={() => onTabChange(i.key)}
                    className={`nav-item ${activeTab === i.key ? 'active' : ''}`}
                >
                    {i.label}
                </span>
            ))}

            <button
                onClick={onLogout}
                className="logout-btn"
            >
                退出
            </button>
        </div>
    );
}

/* ================= 管理员首页（唯一导出） ================= */

export default function AdminHome() {
    const [activeTab, setActiveTab] = useState('review');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const render = () => {
        if (activeTab === 'review') return <HotelReviewPage />;
        if (activeTab === 'online-offline') return <OnlineOfflineManagementPage />;
        if (activeTab === 'published') return <PublishedHotelsPage />;
    };

    return (
        <div className="admin-container">
            <AdminNavbar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
            />
            {render()}
        </div>
    );
}
