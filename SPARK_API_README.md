# 讯飞星火HTTP API配置指南

## 环境变量配置

请在项目根目录创建 `.env` 文件，并添加以下环境变量：

```bash
# 讯飞星火HTTP API配置
SPARK_API_PASSWORD=你的APIPassword
```

## 获取APIPassword

1. 访问 [讯飞开放平台](https://www.xfyun.cn/)
2. 注册并登录账号
3. 创建应用并开通Spark服务
4. 在控制台找到"http服务接口认证信息"
5. 复制 `APIPassword` 字段的值

**重要提示**: 
- 现在使用的是**HTTP接口**，不是WebSocket
- 只需要配置 `SPARK_API_PASSWORD` 一个环境变量
- APIPassword就是Bearer Token，用于HTTP鉴权

## API接口说明

现在您可以通过标准HTTP接口调用讯飞星火大模型：

### 接口地址
```
POST /api/chat-spark
```

### 请求参数
```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好，请介绍一下自己"
    }
  ]
}
```

### 响应格式
```json
{
  "content": "我是讯飞星火认知大模型...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "model": "generalv3.5",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

## 技术实现

新的实现基于讯飞星火官方HTTP API：

- **API地址**: `https://spark-api-open.xf-yun.com/v1/chat/completions`
- **鉴权方式**: Bearer Token（APIPassword）
- **请求格式**: 标准HTTP JSON格式
- **模型版本**: generalv3.5（对应Spark Pro）

## 常见问题

### 1. AppIdNoAuthError 错误
这个错误通常是因为：
- 没有配置 `SPARK_API_PASSWORD` 环境变量
- APIPassword不正确
- 服务未正确开通

### 2. 如何获取APIPassword
在讯飞开放平台控制台：
1. 进入应用详情
2. 找到"http服务接口认证信息"部分
3. 复制"APIPassword"字段的值

### 3. 支持的模型版本
- `generalv3.5` - Spark Pro
- `generalv4.0` - Spark Max
- 更多版本请参考官方文档

## 参考文档

- [讯飞星火HTTP调用文档](https://www.xfyun.cn/doc/spark/HTTP%E8%B0%83%E7%94%A8%E6%96%87%E6%A1%A3.html)
- [讯飞开放平台](https://www.xfyun.cn/) 