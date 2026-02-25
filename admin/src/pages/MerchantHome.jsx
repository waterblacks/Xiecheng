import { useEffect, useState } from 'react';

const BASE = 'http://localhost:3000/api';

export default function MerchantHotelEditor() {

    const [hotelId, setHotelId] = useState(null);

    const [form, setForm] = useState({
        name_cn: '',
        address: '',
        star_rating: 3,
        description: ''
    });

    const token = localStorage.getItem('token');

    const onChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // 保存（新建或更新）
    const save = async () => {

        const url = hotelId
            ? `${BASE}/merchant/hotels/${hotelId}`
            : `${BASE}/merchant/hotels`;

        const method = hotelId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (data.success && data.data?.id) {
            setHotelId(data.data.id);
        }

        alert(data.message || '保存成功');
    };

    // 提交审核
    const submit = async () => {
        if (!hotelId) return alert('请先保存');

        const res = await fetch(
            `${BASE}/merchant/hotels/${hotelId}/submit`,
            {
                method:'POST',
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const data = await res.json();
        alert(data.message);
    };

    return (
        <div style={{ padding:20 }}>
            <h2>商户酒店信息录入 / 编辑</h2>

            <div>
                酒店名称：
                <input name="name_cn" value={form.name_cn} onChange={onChange}/>
            </div>

            <div>
                地址：
                <input name="address" value={form.address} onChange={onChange}/>
            </div>

            <div>
                星级：
                <input name="star_rating" value={form.star_rating} onChange={onChange}/>
            </div>

            <div>
                描述：
                <textarea name="description" value={form.description} onChange={onChange}/>
            </div>

            <br/>

            <button onClick={save}>保存</button>
            <button onClick={submit} style={{ marginLeft:10 }}>提交审核</button>

        </div>
    );
}