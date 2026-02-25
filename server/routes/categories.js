import express from 'express';
const router = express.Router();
import { categories } from '../mocks/hotels.js';

// 获取所有分类
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: categories,
    });
});

export default router;
