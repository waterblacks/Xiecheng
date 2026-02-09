const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 中间件配置
app.use(cors()); // 允许前端跨域访问
app.use(express.json()); // 让服务器能看懂前端发来的 JSON 数据

const PORT = process.env.PORT || 3000;

// 测试路由
app.get('/', (req, res) => {
  res.send('易宿酒店后端接口已成功启动！🚀');
});

app.listen(PORT, () => {
  console.log(`服务器启动成功，地址: http://localhost:${PORT}`);
});