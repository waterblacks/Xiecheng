import express from 'express';
const router = express.Router();

// 导入 mock 数据
import { featuredHotels, hotelList, hotelDetail, hotelRooms, categories } from '../mocks/hotels.js';

// 获取精选酒店列表
router.get('/featured/list', (req, res) => {
    res.json({
        success: true,
        data: featuredHotels,
    });
});

// 获取酒店列表（带分页和筛选）
router.get('/list', (req, res) => {
    let filtered = [...hotelList];

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

// 搜索酒店
router.get('/search', (req, res) => {
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

    res.json({
        success: true,
        data: allResults,
        total: allResults.length,
        matched_count: matched.length,
    });
});

// 获取酒店详情
router.get('/:id', (req, res) => {
    const hotel = hotelDetail[req.params.id] || hotelDetail[1];
    res.json({
        success: true,
        data: hotel,
    });
});

// 获取酒店房型
router.get('/:id/rooms', (req, res) => {
    const rooms = hotelRooms[req.params.id] || hotelRooms[1];
    res.json({
        success: true,
        data: rooms,
    });
});

export default router;
