import { useEffect, useState} from 'react';
console.log('MerchantHome FILE LOADED');

const BASE = 'http://localhost:3000/api';

/* ========== 顶部导航组件 ========== */
const Navbar = ({ tab, setTab, createNew }) => (
    <div style={{
        padding: 10,
        background: '#001529',
        color: '#fff'
    }}>
        <span
            style={{ marginRight: 20, cursor: 'pointer', color: tab === 'list' ? '#1890ff' : '#fff' }}
            onClick={() => setTab('list')}
        >
            我的酒店
        </span>

        <span
            style={{ cursor: 'pointer', color: tab === 'edit' ? '#1890ff' : '#fff' }}
            onClick={createNew}
        >
            新建酒店
        </span>
    </div>
);

/* ========== 酒店列表页组件 ========== */
const ListView = ({ list, editHotel }) => (
    <div style={{ padding: 20 }}>
        <h3>我的酒店</h3>

        <table border="1" cellPadding="6" width="100%">
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
                        <span style={{
                            color: h.status === 'rejected' ? 'red' :
                                h.status === 'approved' ? 'green' : 'inherit'
                        }}>
                            {h.status}
                        </span>
                        {h.status === 'rejected' && h.reject_reason && (
                            <div style={{
                                color: '#ff4d4f',
                                fontSize: '12px',
                                marginTop: '4px',
                                maxWidth: '150px'
                            }}>
                                原因：{h.reject_reason}
                            </div>
                        )}
                    </td>
                    <td>
                        <button onClick={() => editHotel(h)}>
                            编辑
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

//* ========== 编辑页组件 ========== */
const EditView = ({ form, onChange, save, submit, hotelId, onAddImage, onRemoveImage, onImageUpload, onImageTypeChange, onAddFacility, onRemoveFacility, onFacilityChange, onAddAttraction, onRemoveAttraction, onAttractionChange }) => {

    return (
        <div style={{ padding: 20, maxWidth: 900 }}>
            <h3>{hotelId ? '编辑酒店' : '新建酒店'}</h3>

            {/* 基本信息 */}
            <fieldset style={{ marginBottom: 20, padding: 15 }}>
                <legend><strong>基本信息</strong></legend>

                <div style={{ marginBottom: 10 }}>
                    中文名：<span style={{ color: 'red' }}>*</span>
                    <input
                        name="name_cn"
                        value={form.name_cn}
                        onChange={onChange}
                        style={{ width: 300, marginLeft: 10 }}
                    />
                </div>

                <div style={{ marginBottom: 10 }}>
                    英文名：
                    <input
                        name="name_en"
                        value={form.name_en}
                        onChange={onChange}
                        style={{ width: 300, marginLeft: 10 }}
                    />
                </div>

                <div style={{ marginBottom: 10 }}>
                    地址：<span style={{ color: 'red' }}>*</span>
                    <input
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        style={{ width: 400, marginLeft: 10 }}
                    />
                </div>

                <div style={{ marginBottom: 10 }}>
                    星级：
                    <select
                        name="star_rating"
                        value={form.star_rating}
                        onChange={onChange}
                        style={{ marginLeft: 10, padding: '5px 10px' }}
                    >
                        <option value={1}>一星级</option>
                        <option value={2}>二星级</option>
                        <option value={3}>三星级</option>
                        <option value={4}>四星级</option>
                        <option value={5}>五星级</option>
                    </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                    起价：<span style={{ color: 'red' }}>*</span>
                    <input
                        type="number"
                        name="min_price"
                        min={0}
                        value={form.min_price}
                        onChange={onChange}
                        style={{ width: 120, marginLeft: 10 }}
                    />
                    <span style={{ marginLeft: 5 }}>元/晚</span>
                </div>

                <div style={{ marginBottom: 10 }}>
                    开业日期：
                    <input
                        type="date"
                        name="opening_date"
                        value={form.opening_date}
                        onChange={onChange}
                        style={{ marginLeft: 10 }}
                    />
                </div>

                <div style={{ marginBottom: 10 }}>
                    酒店描述：
                    <br />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        style={{ width: '100%', height: 80, marginTop: 5, padding: 8 }}
                        placeholder="请输入酒店描述（不填则前台不显示）"
                    />
                </div>

                <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'inline-block', marginRight: 20 }}>
                        纬度：
                        <input
                            type="number"
                            step="0.0001"
                            name="latitude"
                            value={form.latitude}
                            onChange={onChange}
                            style={{ width: 120, marginLeft: 10 }}
                        />
                    </div>
                    <div style={{ display: 'inline-block' }}>
                        经度：
                        <input
                            type="number"
                            step="0.0001"
                            name="longitude"
                            value={form.longitude}
                            onChange={onChange}
                            style={{ width: 120, marginLeft: 10 }}
                        />
                    </div>
                </div>
            </fieldset>

            {/* 酒店图片 - 修正版 */}
            <fieldset style={{ marginBottom: 20, padding: 15 }}>
                <legend><strong>酒店图片</strong></legend>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {form.images && form.images.map((img, index) => (
                        <div key={img.id || index} style={{
                            width: 220,
                            padding: 10,
                            background: '#f9f9f9',
                            borderRadius: 4,
                            border: '1px solid #ddd'
                        }}>
                            {/* 图片预览区域 */}
                            <div style={{
                                width: '100%',
                                height: 140,
                                background: '#eee',
                                marginBottom: 8,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
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

                            {/* ✅ 修正：将 input 包裹在 label 内部，实现点击触发 */}
                            <label
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '8px 0',
                                    background: '#fff',
                                    border: '1px dashed #1890ff',
                                    color: '#1890ff',
                                    cursor: 'pointer',
                                    marginBottom: 8,
                                    textAlign: 'center'
                                }}
                            >
                                {img.url ? '重新上传' : '点击上传图片'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) onImageUpload(index, file);
                                        // 清空 value 允许重复选择同一张图片
                                        e.target.value = '';
                                    }}
                                />
                            </label>

                            {/* 图片类型选择 */}
                            <div style={{ marginBottom: 5 }}>
                                <select
                                    value={img.type}
                                    onChange={(e) => onImageTypeChange(index, e.target.value)}
                                    style={{ width: '100%', padding: '3px' }}
                                >
                                    <option value="banner">横幅/封面</option>
                                    <option value="room">客房</option>
                                    <option value="facility">设施</option>
                                    <option value="lobby">大堂</option>
                                    <option value="exterior">外观</option>
                                </select>
                            </div>

                            {/* 删除按钮 */}
                            {form.images.length > 1 && (
                                <button
                                    onClick={() => onRemoveImage(index)}
                                    style={{
                                        width: '100%',
                                        padding: '5px 0',
                                        background: '#ff4d4f',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    删除
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onAddImage}
                    style={{
                        marginTop: 15,
                        padding: '8px 16px',
                        background: '#1890ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    + 添加图片
                </button>
            </fieldset>

            {/* 酒店设施 */}
            <fieldset style={{ marginBottom: 20, padding: 15 }}>
                <legend><strong>酒店设施</strong>（不添加则前台不显示）</legend>

                {form.facilities && form.facilities.map((facility, index) => (
                    <div key={facility.id || index} style={{
                        marginBottom: 10,
                        padding: 10,
                        background: '#f9f9f9',
                        borderRadius: 4,
                        border: '1px solid #ddd'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span>类型：</span>
                            <select
                                value={facility.facility_type}
                                onChange={(e) => onFacilityChange(index, 'facility_type', e.target.value)}
                                style={{ padding: '5px' }}
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

                            <span>描述：</span>
                            <input
                                value={facility.description}
                                onChange={(e) => onFacilityChange(index, 'description', e.target.value)}
                                style={{ flex: 1, minWidth: 150 }}
                                placeholder="如：24小时开放"
                            />

                            <button
                                onClick={() => onRemoveFacility(index)}
                                style={{
                                    color: 'red',
                                    background: 'none',
                                    border: '1px solid red',
                                    cursor: 'pointer',
                                    padding: '2px 8px'
                                }}
                            >
                                删除
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={onAddFacility}
                    style={{
                        padding: '8px 16px',
                        background: '#1890ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    + 添加设施
                </button>
            </fieldset>

            {/* 周边景点 */}
            <fieldset style={{ marginBottom: 20, padding: 15 }}>
                <legend><strong>周边景点/地标</strong></legend>

                {form.attractions && form.attractions.map((attraction, index) => (
                    <div key={attraction.id || index} style={{
                        marginBottom: 10,
                        padding: 10,
                        background: '#f9f9f9',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <span>名称：</span>
                        <input
                            value={attraction.name}
                            onChange={(e) => onAttractionChange(index, 'name', e.target.value)}
                            style={{ width: 120 }}
                        />

                        <span>距离：</span>
                        <input
                            value={attraction.distance}
                            onChange={(e) => onAttractionChange(index, 'distance', e.target.value)}
                            style={{ width: 80 }}
                            placeholder="0.5公里"
                        />

                        <button
                            onClick={() => onRemoveAttraction(index)}
                            style={{
                                color: 'red',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            删除
                        </button>
                    </div>
                ))}

                <button
                    onClick={onAddAttraction}
                    style={{
                        padding: '8px 16px',
                        background: '#1890ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    + 添加景点
                </button>
            </fieldset>

            {/* 操作按钮 */}
            <div style={{ marginTop: 30 }}>
                <button
                    onClick={save}
                    style={{
                        padding: '10px 30px',
                        background: '#52c41a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 16
                    }}
                >
                    保存
                </button>

                <button
                    onClick={submit}
                    style={{
                        marginLeft: 10,
                        padding: '10px 30px',
                        background: '#1890ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 16
                    }}
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
        <div>
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
