# 图片显示问题故障排除指南

## 🔍 问题现象

- ✅ 图片上传成功
- ✅ 腾讯云COS中可以看到文件
- ❌ Markdown预览中看不到图片
- ❌ 前端页面中图片不显示

## 🛠️ 解决方案

### 1. 使用调试工具

访问：`http://localhost:3000/api/debug-cos`

这会显示你的配置状态和建议。

### 2. 检查环境变量

确保 `.env` 文件中的配置正确：

```env
TENCENT_COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxx
TENCENT_COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_REGION=ap-beijing
TENCENT_COS_BUCKET=你的存储桶名称
TENCENT_COS_DOMAIN=https://你的存储桶名称.cos.ap-beijing.myqcloud.com
```

**常见错误：**
- ❌ 域名缺少 `https://` 前缀
- ❌ 存储桶名称不完整（缺少数字后缀）
- ❌ 地域配置错误

### 3. 验证存储桶权限

1. 登录腾讯云COS控制台
2. 选择你的存储桶
3. 进入"权限管理" > "存储桶访问权限"
4. 确保设置为：**公有读私有写**

### 4. 测试图片直接访问

1. 上传一张图片
2. 复制返回的URL
3. 在浏览器中直接访问
4. 如果无法访问，说明存储桶权限或域名配置有问题

### 5. 添加具体域名到Next.js配置

如果你的域名是 `mybucket-123456.cos.ap-beijing.myqcloud.com`，可以手动添加：

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ... 其他配置
      {
        protocol: 'https',
        hostname: 'mybucket-123456.cos.ap-beijing.myqcloud.com', // 你的具体域名
      },
    ],
    domains: [
      // ... 其他配置
      'mybucket-123456.cos.ap-beijing.myqcloud.com', // 你的具体域名
    ],
  },
}
```

然后重启开发服务器：`pnpm dev`

### 6. 检查浏览器控制台

打开开发者工具，查看：
- Network 面板：图片请求是否成功
- Console 面板：是否有错误信息

## 🔧 常见错误及解决方案

### 错误1：403 Forbidden
**原因：** 存储桶权限设置错误
**解决：** 设置存储桶为"公有读私有写"

### 错误2：图片URL无法访问
**原因：** 域名配置错误
**解决：** 检查 `TENCENT_COS_DOMAIN` 格式

### 错误3：Next.js Image组件报错
**原因：** 域名未添加到Next.js配置
**解决：** 添加具体域名到 `next.config.ts`

### 错误4：CORS跨域错误
**原因：** 存储桶CORS配置问题
**解决：** 在COS控制台配置CORS规则

## ✅ 验证步骤

完成配置后，按以下步骤验证：

1. **重启开发服务器** `pnpm dev`
2. **访问调试API** 确认配置正确
3. **上传测试图片** 查看控制台日志
4. **直接访问图片URL** 确认可以访问
5. **检查Markdown预览** 确认图片显示
6. **查看前端页面** 确认图片正常显示

## 🆘 如果仍有问题

1. 查看开发服务器控制台的详细日志
2. 检查浏览器开发者工具的错误信息
3. 确认腾讯云COS控制台中文件确实存在
4. 尝试使用不同的图片格式（jpg, png, webp）

## 📞 获取帮助

如果问题仍然存在，请提供：
- 调试API的完整输出
- 上传时的控制台日志
- 浏览器开发者工具的错误信息
- 你的环境变量配置（隐藏敏感信息）
