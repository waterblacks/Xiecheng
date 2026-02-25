import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const SECRET = 'xiecheng-secret';

let users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'merchant', password: 'merchant123', role: 'merchant' }
];

let idCounter = 3;

//注册
router.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.json({ success: false, message: '参数不完整' });
    }

    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.json({ success: false, message: '用户名已存在' });
    }

    const user = {
        id: idCounter++,
        username,
        password,
        role
    };

    users.push(user);

    res.json({
        success: true,
        message: '注册成功',
        data: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

/**
 * 登录
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ success: false, message: '用户名或密码错误' });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        success: true,
        message: '登录成功',
        data: {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        }
    });
});

/**
 * 获取当前用户
 */
router.get('/profile', (req, res, next) => {
    import('../middleware/auth.js').then(authMiddleware => {
        authMiddleware.default(req, res, () => {
            const user = users.find(u => u.id === req.user.id);
            
            res.json({
                success: true,
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    created_at: '2026-01-29 10:00:00'
                }
            });
        });
    }).catch(next);
});

export default router;
