import { useEffect, useState } from 'react';

const BASE = 'http://localhost:3000/api';

export default function MerchantHotelPage() {

    const token = sessionStorage.getItem('token');

    const [tab, setTab] = useState('list');   // list | edit
    const [list, setList] = useState([]);

    const emptyForm = {
        name_cn: '',
        name_en: '',
        address: '',
        star_rating: 3,
        min_price: 0,
        description: ''
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
            star_rating: h.star_rating || 3,
            min_price: h.min_price || 0,
            description: h.description || ''
        });

        setTab('edit');
    };

    /* ========== 保存（新建或更新） ========== */

    const save = async () => {

        if (!form.name_cn.trim()) {
            alert('请输入酒店名称');
            return;
        }

        const star = Number(form.star_rating);
        const price = Number(form.min_price);

        if (!Number.isInteger(star) || star < 1 || star > 5) {
            alert('星级必须是 1 到 5 的整数');
            return;
        }

        if (isNaN(price) || price < 0) {
            alert('最低价不能小于 0');
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

    /* ========== 顶部导航 ========== */

    const Navbar = () => (
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

    /* ========== 酒店列表页 ========== */

    const ListView = () => (
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
                        <td>{h.status}</td>
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

    /* ========== 编辑页 ========== */

    const EditView = () => (
        <div style={{ padding: 20 }}>

            <h3>{hotelId ? '编辑酒店' : '新建酒店'}</h3>

            <div>
                中文名：
                <input name="name_cn" value={form.name_cn} onChange={onChange}/>
            </div>

            <div>
                英文名：
                <input name="name_en" value={form.name_en} onChange={onChange}/>
            </div>

            <div>
                地址：
                <input name="address" value={form.address} onChange={onChange}/>
            </div>

            <div>
                星级：
                <input
                    type="number"
                    name="star_rating"
                    min={1}
                    max={5}
                    value={form.star_rating}
                    onChange={onChange}
                />
            </div>

            <div>
                起价：
                <input
                    type="number"
                    name="min_price"
                    min={0}
                    value={form.min_price}
                    onChange={onChange}
                />
            </div>

            <div>
                描述：
                <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                />
            </div>

            <br/>

            <button onClick={save}>保存</button>

            <button
                onClick={submit}
                style={{ marginLeft: 10 }}
            >
                提交审核
            </button>

        </div>
    );

    return (
        <div>
            <Navbar />
            {tab === 'list' ? <ListView /> : <EditView />}
        </div>
    );
}