const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
/* =========================
   管理员首页统计
========================= */
app.get('/api/admin/stats/overview', authMiddleware, (req, res) => {
    // 真实项目要校验角色
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: '无权限'
        });
    }

    res.json({
        success: true,
        data: {
            total_hotels: 50,
            pending_hotels: 5,
            approved_hotels: 40,
            offline_hotels: 3,
            total_merchants: 20
        }
    });
});

/* =========================
   商户首页：我的酒店
========================= */
app.get('/api/merchant/hotels', authMiddleware, (req, res) => {
    if (req.user.role !== 'merchant') {
        return res.status(403).json({
            success: false,
            message: '无权限'
        });
    }

    res.json({
        success: true,
        data: [
            {
                id: 1,
                name_cn: '测试酒店A',
                status: 'approved',
                room_count: 3,
                min_price: 500,
                created_at: '2026-01-29'
            },
            {
                id: 2,
                name_cn: '测试酒店B',
                status: 'pending',
                room_count: 5,
                min_price: 699,
                created_at: '2026-02-01'
            }
        ]
    });
});

app.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
