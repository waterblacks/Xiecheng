import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import hotelRoutes from './routes/hotels.js';
import categoryRoutes from './routes/categories.js';
import authMiddleware from './middleware/auth.js';
import { hotelList } from './mocks/hotels.js';

const app = express();

app.use(cors());
app.use(express.json());

// 静态文件服务（用于提供 mock 数据文件）
app.use('/mocks', express.static(path.join(__dirname, '../mobile/src/mocks')));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);      // 新增酒店路由
app.use('/api/categories', categoryRoutes); // 新增分类路由

let hotelId = 21;
let hotels = [];
// 初始化 mock 数据到内存
hotelList.forEach(mockHotel => {
    hotels.push({
        id: mockHotel.id,
        merchantId: 2, // 默认商户ID
        name_cn: mockHotel.name_cn,
        name_en: mockHotel.name_en,
        address: mockHotel.address,
        star_rating: mockHotel.star_rating,
        min_price: mockHotel.min_price,
        status: 'approved', // 默认状态为已审核通过
        created_at: new Date().toISOString().slice(0,10),
        description: `${mockHotel.name_cn}位于${mockHotel.address.split('市')[0]}核心地段，是一家集商务与休闲于一体的豪华酒店。`
    });
});

/* =========================
   管理员首页统计
========================= */
//查看全部酒店
app.get('/api/admin/hotels', authMiddleware, (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    res.json({ success:true,data:hotels });
});
//审核通过
app.put('/api/admin/hotels/:id/approve', authMiddleware, (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const hotel = hotels.find(h => h.id == req.params.id);

    hotel.status = 'approved';

    res.json({ success:true,message:'审核通过' });
});
//审核不通过
app.put('/api/admin/hotels/:id/reject', authMiddleware, (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const hotel = hotels.find(h => h.id == req.params.id);

    hotel.status = 'rejected';

    res.json({ success:true,message:'审核不通过' });
});
//下线酒店
app.put('/api/admin/hotels/:id/offline', authMiddleware, (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const hotel = hotels.find(h => h.id == req.params.id);

    hotel.status = 'offline';

    res.json({ success:true,message:'酒店已下线' });
});
//恢复上线
app.put('/api/admin/hotels/:id/online', authMiddleware, (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const hotel = hotels.find(h => h.id == req.params.id);

    hotel.status = 'approved';

    res.json({ success:true,message:'酒店已恢复上线' });
});
/* =========================
   商户首页：我的酒店
========================= */
//新建酒店
app.post('/api/merchant/hotels', authMiddleware, (req, res) => {

    if (req.user.role !== 'merchant') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const hotel = {
        id: hotelId++,
        merchantId: req.user.id,
        ...req.body,
        status: 'draft',   // 草稿
        created_at: new Date().toISOString().slice(0,10)
    };

    hotels.push(hotel);

    res.json({
        success: true,
        message: '酒店创建成功',
        data: { id: hotel.id }
    });
});
//更新酒店
app.put('/api/merchant/hotels/:id', authMiddleware, (req, res) => {

    if (req.user.role !== 'merchant') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const id = Number(req.params.id);

    const hotel = hotels.find(
        h => h.id === id && h.merchantId === req.user.id
    );

    if (!hotel) {
        return res.status(404).json({ success:false,message:'酒店不存在' });
    }

    Object.assign(hotel, req.body);

    res.json({ success:true,message:'更新成功' });
});
//提交审核
app.post('/api/merchant/hotels/:id/submit', authMiddleware, (req, res) => {

    if (req.user.role !== 'merchant') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const id = Number(req.params.id);

    const hotel = hotels.find(
        h => h.id === id && h.merchantId === req.user.id
    );

    if (!hotel) {
        return res.status(404).json({ success:false,message:'酒店不存在' });
    }

    hotel.status = 'pending';

    res.json({ success:true,message:'提交审核成功' });
});

app.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
