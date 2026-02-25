import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
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
        description: `${mockHotel.name_cn}位于${mockHotel.address.split('市')[0]}核心地段，是一家集商务与休闲于一体的豪华酒店。`,
        images: mockHotel.images || [`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400`]
    });
});

/* =========================
   统一的酒店API路由
========================= */

// 获取精选酒店列表
app.get('/api/hotels/featured/list', (req, res) => {
    // 只返回已审核通过的酒店作为精选
    const featured = hotels
        .filter(h => h.status === 'approved')
        .slice(0, 4)
        .map(h => ({
            id: h.id,
            name_cn: h.name_cn,
            name_en: h.name_en,
            star_rating: h.star_rating,
            min_price: h.min_price,
            images: h.images && h.images.length > 0
                ? h.images
                : [`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400`]
        }));

    res.json({
        success: true,
        data: featured,
    });
});

// 获取酒店列表（带分页和筛选）- 只显示已审核通过的酒店
app.get('/api/hotels/list', (req, res) => {
    // 只显示已审核通过的酒店
    let filtered = hotels.filter(h => h.status === 'approved');

    // 筛选逻辑
    if (req.query.city) {
        filtered = filtered.filter((h) => h.address.includes(req.query.city));
    }
    if (req.query.star_rating) {
        filtered = filtered.filter((h) => h.star_rating === parseInt(req.query.star_rating));
    }
    if (req.query.min_price) {
        filtered = filtered.filter((h) => h.min_price >= parseInt(req.query.min_price));
    }
    if (req.query.max_price) {
        filtered = filtered.filter((h) => h.min_price <= parseInt(req.query.max_price));
    }

    // 排序逻辑
    if (req.query.sort_by === 'min_price' && req.query.sort_order === 'ASC') {
        filtered.sort((a, b) => a.min_price - b.min_price);
    } else if (req.query.sort_by === 'min_price' && req.query.sort_order === 'DESC') {
        filtered.sort((a, b) => b.min_price - a.min_price);
    } else if (req.query.sort_by === 'star_rating') {
        filtered.sort((a, b) => b.star_rating - a.star_rating);
    }

    // 分页处理
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    // 添加 images 字段
    const dataWithImages = paged.map(h => ({
        ...h,
        images: h.images && h.images.length > 0
            ? h.images
            : [`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400`]
    }));

    res.json({
        success: true,
        data: paged,
        pagination: {
            page,
            pageSize,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / pageSize),
        },
    });
});

// 搜索酒店 - 只搜索已审核通过的酒店
app.get('/api/hotels/search', (req, res) => {
    // 只搜索已审核通过的酒店
    let hotelList = hotels.filter(h => h.status === 'approved');
    let matched = [];
    let other = [];

    if (req.query.keyword) {
        const kw = req.query.keyword.toLowerCase();
        const kwCn = req.query.keyword;

        hotelList.forEach((h) => {
            const nameMatch = h.name_cn.includes(kwCn) || h.name_en.toLowerCase().includes(kw);
            const addressMatch = h.address.includes(kwCn);

            if (nameMatch || addressMatch) {
                matched.push({ ...h, is_matched: true });
            } else {
                other.push({ ...h, is_matched: false });
            }
        });
    } else {
        matched = hotelList.map(h => ({ ...h, is_matched: true }));
    }

    // 应用其他筛选条件
    if (req.query.city) {
        matched = matched.filter((h) => h.address.includes(req.query.city));
        other = other.filter((h) => h.address.includes(req.query.city));
    }

    const allResults = [...matched, ...other];

    // 添加 images 字段
    const dataWithImages = allResults.map(h => ({
        ...h,
        images: h.images && h.images.length > 0
            ? h.images
            : [`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400`]
    }));

    res.json({
        success: true,
        data: allResults,
        total: allResults.length,
        matched_count: matched.length,
    });
});

// 获取酒店详情
app.get('/api/hotels/:id', (req, res) => {
    const hotel = hotels.find(h => h.id == req.params.id);

    if (!hotel) {
        return res.status(404).json({ success: false, message: '酒店不存在' });
    }

    // 只允许查看已审核通过的酒店详情
    if (hotel.status !== 'approved') {
        return res.status(403).json({ success: false, message: '酒店未审核通过' });
    }

    const hotelDetail = {
        id: hotel.id,
        name_cn: hotel.name_cn,
        name_en: hotel.name_en,
        address: hotel.address,
        star_rating: hotel.star_rating,
        opening_date: '2015-01-01',
        description: hotel.description,
        latitude: 31.2 + Math.random() * 0.1,
        longitude: 121.4 + Math.random() * 0.1,
        images: [
            { id: 1, url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', type: 'banner', display_order: 0 },
            { id: 2, url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', type: 'room', display_order: 1 },
            { id: 3, url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', type: 'facility', display_order: 2 },
            { id: 4, url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', type: 'lobby', display_order: 3 },
        ],
        facilities: [
            { id: 1, facility_type: '免费WiFi', description: '全馆免费高速WiFi' },
            { id: 2, facility_type: '游泳池', description: '室内恒温泳池' },
            { id: 3, facility_type: '健身房', description: '24小时健身中心' },
            { id: 4, facility_type: 'SPA', description: '豪华SPA水疗中心' },
            { id: 5, facility_type: '餐厅', description: '多家特色餐厅' },
            { id: 6, facility_type: '停车场', description: '免费停车服务' },
        ],
        attractions: [
            { id: 1, name: '市中心商业区', type: 'attraction', distance: '0.5公里' },
            { id: 2, name: '地铁站', type: 'attraction', distance: '0.3公里' },
            { id: 3, name: '购物中心', type: 'attraction', distance: '1.0公里' },
        ],
        promotions: hotel.id <= 5 ? [
            { id: 1, type: 'holiday', discount: 0.85, description: '限时特惠85折', start_date: '2026-01-20', end_date: '2026-03-10' },
        ] : [],
    };

    res.json({
        success: true,
        data: hotelDetail,
    });
});

// 获取酒店房型
app.get('/api/hotels/:id/rooms', (req, res) => {
    const hotel = hotels.find(h => h.id == req.params.id);

    if (!hotel) {
        return res.status(404).json({ success: false, message: '酒店不存在' });
    }

    if (hotel.status !== 'approved') {
        return res.status(403).json({ success: false, message: '酒店未审核通过' });
    }

    const rooms = [
        {
            id: hotel.id * 10 + 1,
            hotel_id: hotel.id,
            name: '标准客房',
            base_price: hotel.min_price,
            description: '温馨舒适的标准房间',
            max_guests: 2,
            bed_type: '大床',
            area: 35,
            nights: 1,
            total_price: `${hotel.min_price}.00`,
            image: null,
            amenities: ['免费WiFi', '空调', '电视', '淋浴'],
        },
        {
            id: hotel.id * 10 + 2,
            hotel_id: hotel.id,
            name: '豪华客房',
            base_price: Math.floor(hotel.min_price * 1.3),
            description: '宽敞明亮的豪华房间',
            max_guests: 2,
            bed_type: '大床',
            area: 45,
            nights: 1,
            total_price: `${Math.floor(hotel.min_price * 1.3)}.00`,
            image: null,
            amenities: ['免费WiFi', '空调', '电视', '浴缸', '迷你吧'],
        },
        {
            id: hotel.id * 10 + 3,
            hotel_id: hotel.id,
            name: '行政套房',
            base_price: Math.floor(hotel.min_price * 2),
            description: '独立起居室，专属服务',
            max_guests: 2,
            bed_type: '特大床',
            area: 65,
            nights: 1,
            total_price: `${Math.floor(hotel.min_price * 2)}.00`,
            image: null,
            amenities: ['免费WiFi', '空调', '电视', '浴缸', '迷你吧', '行政酒廊'],
        }
    ];

    res.json({
        success: true,
        data: rooms,
    });
});

/* =========================
   管理员首页
========================= */
//查看全部酒店
app.get('/api/admin/hotels', authMiddleware, (req, res) => {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success:false,message:'无权限' });
    }
    const { status } = req.query;

    let list = hotels;

    if (status) {
        list = list.filter(h => h.status === status);
    }

    res.json({ success:true, data: list });
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
   商户首页
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
    if (hotel.status !== 'draft' && hotel.status !== 'rejected') {
        return res.json({ success:false, message:'当前状态不可提交审核' });
    }

    hotel.status = 'pending';

    res.json({ success:true,message:'提交审核成功' });
});
//查询用户的当前酒店
app.get('/api/merchant/hotels', authMiddleware, (req, res) => {

    if (req.user.role !== 'merchant') {
        return res.status(403).json({ success:false,message:'无权限' });
    }

    const list = hotels.filter(h => h.merchantId === req.user.id);

    res.json({
        success: true,
        data: list
    });
});

app.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
