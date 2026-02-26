import { useEffect, useState } from 'react';
import './MerchantHome.css'; // 引入分离出来的 CSS 文件

const BASE = 'http://localhost:3000/api';

/* ========== 顶部导航组件 ========== */
const Navbar = ({ tab, setTab, createNew }) => (
    <div className="merchant-navbar">
        <span
            className={`merchant-nav-item ${tab === 'list' ? 'active' : ''}`}
            onClick={() => setTab('list')}
        >
            我的酒店
        </span>

        <span
            className={`merchant-nav-item ${tab === 'edit' ? 'active' : ''}`}
            onClick={createNew}
        >
            新建酒店
        </span>
    </div>
);

/* ========== 酒店列表页组件 ========== */
const ListView = ({ list, editHotel }) => (
    <div className="merchant-content">
        <h3 className="merchant-title">我的酒店</h3>

        <div className="hotel-list">
            <table className="hotel-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>酒店名</th>
                    <th>地址</th>
                    <th>价格</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {list.map(h => (
                    <tr key={h.id}>
                        <td>{h.id}</td>
                        <td>{h.name_cn}</td>
                        <td>{h.address}</td>
                        <td>{h.min_price}</td>
                        <td>
                                <span className={`status-badge ${h.status === 'rejected' ? 'status-rejected' : h.status === 'approved' ? 'status-approved' : 'status-pending'}`}>
                                    {h.status}
                                </span>
                            {h.status === 'rejected' && h.reject_reason && (
                                <div className="reject-reason">
                                    原因：{h.reject_reason}
                                </div>
                            )}
                        </td>
                        <td>
                            <button
                                className="action-btn"
                                onClick={() => editHotel(h)}
                            >
                                编辑
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

/* ========== 编辑页组件 ========== */
const EditView = ({ form, onChange, save, submit, hotelId, onAddImage, onRemoveImage, onImageUpload, onImageTypeChange, onAddFacility, onRemoveFacility, onFacilityChange, onAddAttraction, onRemoveAttraction, onAttractionChange }) => {

    return (
        <div className="edit-form">
            <h3 className="section-title">{hotelId ? '编辑酒店' : '新建酒店'}</h3>

            {/* 基本信息 */}
            <div className="form-section">
                <h4 className="section-title">基本信息</h4>

                <div className="form-field">
                    <label className="form-label">
                        中文名：<span className="required-mark">*</span>
                    </label>
                    <input
                        name="name_cn"
                        value={form.name_cn}
                        onChange={onChange}
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">英文名：</label>
                    <input
                        name="name_en"
                        value={form.name_en}
                        onChange={onChange}
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">
                        地址：<span className="required-mark">*</span>
                    </label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">星级：</label>
                    <select
                        name="star_rating"
                        value={form.star_rating}
                        onChange={onChange}
                        className="form-select"
                    >
                        <option value={1}>一星级</option>
                        <option value={2}>二星级</option>
                        <option value={3}>三星级</option>
                        <option value={4}>四星级</option>
                        <option value={5}>五星级</option>
                    </select>
                </div>

                <div className="form-field">
                    <label className="form-label">
                        起价：<span className="required-mark">*</span>
                    </label>
                    <input
                        type="number"
                        name="min_price"
                        min={0}
                        value={form.min_price}
                        onChange={onChange}
                        className="form-input"
                    />
                    <span className="price-unit">元/晚</span>
                </div>

                <div className="form-field">
                    <label className="form-label">开业日期：</label>
                    <input
                        type="date"
                        name="opening_date"
                        value={form.opening_date}
                        onChange={onChange}
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">酒店描述：</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        className="form-textarea"
                        placeholder="请输入酒店描述（不填则前台不显示）"
                    />
                </div>

                <div className="form-field">
                    <div className="form-label">纬度：</div>
                    <input
                        type="number"
                        step="0.0001"
                        name="latitude"
                        value={form.latitude}
                        onChange={onChange}
                        className="form-input"
                        style={{ width: 120, marginRight: 20 }}
                    />
                    <div className="form-label">经度：</div>
                    <input
                        type="number"
                        step="0.0001"
                        name="longitude"
                        value={form.longitude}
                        onChange={onChange}
                        className="form-input"
                        style={{ width: 120 }}
                    />
                </div>
            </div>

            {/* 酒店图片 */}
            <div className="form-section">
                <h4 className="section-title">酒店图片</h4>

                <div className="image-upload-area">
                    {form.images && form.images.map((img, index) => (
                        <div key={img.id || index} className="image-card">
                            {/* 图片预览区域 */}
                            <div className="image-preview">
                                {img.url ? (
                                    <img
                                        src={img.url}
                                        alt="预览"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span style={{ color: '#999' }}>暂无图片</span>
                                )}
                            </div>

                            {/* 图片上传按钮 */}
                            <label className="image-upload-btn">
                                {img.url ? '重新上传' : '点击上传图片'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) onImageUpload(index, file);
                                        e.target.value = '';
                                    }}
                                />
                            </label>

                            {/* 图片类型选择 */}
                            <select
                                value={img.type}
                                onChange={(e) => onImageTypeChange(index, e.target.value)}
                                className="image-type-select"
                            >
                                <option value="banner">横幅/封面</option>
                                <option value="room">客房</option>
                                <option value="facility">设施</option>
                                <option value="lobby">大堂</option>
                                <option value="exterior">外观</option>
                            </select>

                            {/* 删除按钮 */}
                            {form.images.length > 1 && (
                                <button
                                    onClick={() => onRemoveImage(index)}
                                    className="delete-image-btn"
                                >
                                    删除
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onAddImage}
                    className="add-image-btn"
                >
                    + 添加图片
                </button>
            </div>

            {/* 酒店设施 */}
            <div className="form-section">
                <h4 className="section-title">酒店设施（不添加则前台不显示）</h4>

                {form.facilities && form.facilities.map((facility, index) => (
                    <div key={facility.id || index} className="facility-item">
                        <div className="form-field">
                            <label className="form-label">类型：</label>
                            <select
                                value={facility.facility_type}
                                onChange={(e) => onFacilityChange(index, 'facility_type', e.target.value)}
                                className="form-select"
                            >
                                <option value="">请选择</option>
                                <option value="免费WiFi">免费WiFi</option>
                                <option value="游泳池">游泳池</option>
                                <option value="健身房">健身房</option>
                                <option value="SPA">SPA</option>
                                <option value="餐厅">餐厅</option>
                                <option value="停车场">停车场</option>
                                <option value="会议室">会议室</option>
                                <option value="洗衣服务">洗衣服务</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">描述：</label>
                            <input
                                value={facility.description}
                                onChange={(e) => onFacilityChange(index, 'description', e.target.value)}
                                className="form-input"
                                style={{ flex: 1, minWidth: 150 }}
                                placeholder="如：24小时开放"
                            />
                        </div>

                        <div className="facility-actions">
                            <button
                                onClick={() => onRemoveFacility(index)}
                                className="delete-btn"
                            >
                                删除
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={onAddFacility}
                    className="add-facility-btn"
                >
                    + 添加设施
                </button>
            </div>

            {/* 周边景点 */}
            <div className="form-section">
                <h4 className="section-title">周边景点/地标</h4>

                {form.attractions && form.attractions.map((attraction, index) => (
                    <div key={attraction.id || index} className="attraction-item">
                        <div className="form-field">
                            <label className="form-label">名称：</label>
                            <input
                                value={attraction.name}
                                onChange={(e) => onAttractionChange(index, 'name', e.target.value)}
                                className="form-input"
                                style={{ width: 120 }}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">距离：</label>
                            <input
                                value={attraction.distance}
                                onChange={(e) => onAttractionChange(index, 'distance', e.target.value)}
                                className="form-input"
                                style={{ width: 80 }}
                                placeholder="0.5公里"
                            />
                        </div>

                        <div className="attraction-actions">
                            <button
                                onClick={() => onRemoveAttraction(index)}
                                className="delete-btn"
                            >
                                删除
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={onAddAttraction}
                    className="add-attraction-btn"
                >
                    + 添加景点
                </button>
            </div>

            {/* 操作按钮 */}
            <div className="action-buttons">
                <button
                    onClick={save}
                    className="save-btn"
                >
                    保存
                </button>

                <button
                    onClick={submit}
                    className="submit-btn"
                >
                    提交审核
                </button>
            </div>
        </div>
    );
};

/* ========== 图片压缩辅助函数 ========== */
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 等比例缩放
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // 转换为 base64，quality 控制质量 (0-1)
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

/* ========== 主组件 ========== */
export default function MerchantHome() {
    console.log('MerchantHome render');
    const token = sessionStorage.getItem('token');

    const [tab, setTab] = useState('list');
    const [list, setList] = useState([]);

    // ✅ 初始状态为空，不再设置默认假数据
    const emptyForm = {
        name_cn: '',
        name_en: '',
        address: '',
        star_rating: 5,
        min_price: 0,
        opening_date: new Date().toISOString().slice(0, 10),
        description: '',
        latitude: 31.2,
        longitude: 121.4,
        images: [
            { id: Date.now(), url: '', type: 'banner', display_order: 0 }
        ],
        facilities: [],
        attractions: [],
        promotions: []
    };

    const [form, setForm] = useState(emptyForm);
    const [hotelId, setHotelId] = useState(null);

    /* ========== 查询我的酒店 ========== */
    const loadMyHotels = async () => {
        const res = await fetch(`${BASE}/merchant/hotels`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (data.success) setList(data.data);
    };

    useEffect(() => {
        document.title = '商户中心 - 酒店管理系统';
        loadMyHotels();
    }, []);

    /* ========== 表单修改 ========== */
    const onChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* ========== 图片管理（支持上传） ========== */
    const onAddImage = () => {
        setForm(prev => ({
            ...prev,
            images: [
                ...prev.images,
                {
                    id: Date.now(),
                    url: '',
                    type: 'room',
                    display_order: prev.images.length
                }
            ]
        }));
    };

    const onRemoveImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // 处理图片上传并压缩
    const onImageUpload = async (index, file) => {
        if (!file) return;

        try {
            // 压缩图片：最大宽800px，质量70%
            const compressedBase64 = await compressImage(file, 800, 0.7);

            // 存入 form
            onImageChange(index, 'url', compressedBase64);
        } catch (error) {
            console.error('图片压缩失败', error);
            alert('图片处理失败，请重试');
        }
    };

    // 修改图片属性
    const onImageChange = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.map((img, i) =>
                i === index ? { ...img, [field]: value } : img
            )
        }));
    };

    const onImageTypeChange = (index, value) => {
        onImageChange(index, 'type', value);
    };

    /* ========== 设施管理 ========== */
    const onAddFacility = () => {
        setForm(prev => ({
            ...prev,
            facilities: [
                ...prev.facilities,
                { id: Date.now(), facility_type: '', description: '' }
            ]
        }));
    };

    const onRemoveFacility = (index) => {
        setForm(prev => ({
            ...prev,
            facilities: prev.facilities.filter((_, i) => i !== index)
        }));
    };

    const onFacilityChange = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            facilities: prev.facilities.map((f, i) =>
                i === index ? { ...f, [field]: value } : f
            )
        }));
    };

    /* ========== 景点管理 ========== */
    const onAddAttraction = () => {
        setForm(prev => ({
            ...prev,
            attractions: [
                ...prev.attractions,
                { id: Date.now(), name: '', type: 'attraction', distance: '' }
            ]
        }));
    };

    const onRemoveAttraction = (index) => {
        setForm(prev => ({
            ...prev,
            attractions: prev.attractions.filter((_, i) => i !== index)
        }));
    };

    const onAttractionChange = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            attractions: prev.attractions.map((a, i) =>
                i === index ? { ...a, [field]: value } : a
            )
        }));
    };

    /* ========== 新建酒店 ========== */
    const createNew = () => {
        setHotelId(null);
        setForm(emptyForm);
        setTab('edit');
    };

    /* ========== 进入编辑 ========== */
    const editHotel = h => {
        setHotelId(h.id);

        setForm({
            name_cn: h.name_cn || '',
            name_en: h.name_en || '',
            address: h.address || '',
            star_rating: h.star_rating || 5,
            min_price: h.min_price || 0,
            opening_date: h.opening_date || new Date().toISOString().slice(0, 10),
            description: h.description || '',
            latitude: h.latitude || 31.2,
            longitude: h.longitude || 121.4,
            images: h.images && h.images.length > 0 ? h.images : emptyForm.images,
            facilities: h.facilities || [],
            attractions: h.attractions || [],
            promotions: h.promotions || []
        });

        setTab('edit');
    };

    /* ========== 保存 ========== */
    const save = async () => {
        if (!form.name_cn.trim()) {
            alert('请输入酒店名称');
            return;
        }
        if (!form.address.trim()) {
            alert('请输入酒店地址');
            return;
        }

        const url = hotelId
            ? `${BASE}/merchant/hotels/${hotelId}`
            : `${BASE}/merchant/hotels`;

        const method = hotelId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (data.success && data.data?.id) {
            setHotelId(data.data.id);
        }

        alert(data.message || '保存成功');
        loadMyHotels();
    };

    /* ========== 提交审核 ========== */
    const submit = async () => {
        if (!hotelId) {
            alert('请先保存酒店');
            return;
        }

        const res = await fetch(
            `${BASE}/merchant/hotels/${hotelId}/submit`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();
        alert(data.message);
        loadMyHotels();
    };

    /* ========== 渲染 ========== */
    return (
        <div className="merchant-container">
            <Navbar
                tab={tab}
                setTab={setTab}
                createNew={createNew}
            />
            {tab === 'list'
                ? <ListView list={list} editHotel={editHotel} />
                : <EditView
                    form={form}
                    onChange={onChange}
                    save={save}
                    submit={submit}
                    hotelId={hotelId}
                    onAddImage={onAddImage}
                    onRemoveImage={onRemoveImage}
                    onImageUpload={onImageUpload}
                    onImageTypeChange={onImageTypeChange}
                    onAddFacility={onAddFacility}
                    onRemoveFacility={onRemoveFacility}
                    onFacilityChange={onFacilityChange}
                    onAddAttraction={onAddAttraction}
                    onRemoveAttraction={onRemoveAttraction}
                    onAttractionChange={onAttractionChange}
                />
            }
        </div>
    );
}
