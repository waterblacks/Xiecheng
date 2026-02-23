const jwt = require('jsonwebtoken');
const SECRET = 'xiecheng-secret';

module.exports = function (req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ success: false, message: '未登录' });
    }

    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ success: false, message: 'token无效' });
    }
};
