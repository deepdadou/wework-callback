/**
 * 企业微信回调验证接口
 * 部署到 Vercel 后获得 HTTPS 地址
 * 用于接收企业微信消息和事件
 */

const crypto = require('crypto');

// Token 从环境变量读取，没有则用默认值
const TOKEN = process.env.WEWORK_TOKEN || 'BNJkkmCIfGIJsM';
const EncodingAESKey = process.env.WEWORK_AES_KEY || '';

/**
 * GET 请求 - 企乚微信验证回调
 */
exports.get = async (req, res) => {
  const { msg_signature, timestamp, nonce, echostr } = req.query;
  
  console.log('收到验证请求:', {
    msg_signature,
    timestamp,
    nonce,
    has_echostr: !!echostr
  });
  
  // 验证签名
  const signature = crypto
    .createHash('sha1')
    .update([TOKEN, timestamp, nonce].sort().join(''))
    .digest('hex');
  
  if (signature === msg_signature) {
    console.log('✅ 验证通过');
    res.status(200).send(echostr);
  } else {
    console.log('❌ 验证失败');
    res.status(403).send('invalid signature');
  }
};

/**
 * POST 请求 - 接收企业微信消息
 */
exports.post = async (req, res) => {
  console.log('收到企业微信消息:', req.body);
  
  // 俙里可以处理各种消息类型
  // 文本消息、图片消息、事件通知等
  
  // TODO: 根据业务需求处理消息
  // 例如：自动回复、消息转发、数据存储等
  
  res.status(200).send('success');
};

/**
 * 主入口 - Vercel Serverless Function
 */
module.exports = async (req, res) => {
  // 设置 CORS 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 路由到对应的处理方法
  if (req.method === 'GET') {
    return exports.get(req, res);
  } else if (req.method === 'POST') {
    return exports.post(req, res);
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
