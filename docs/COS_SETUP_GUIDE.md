# 腾讯云COS配置指南

## 📋 快速配置步骤

### 1. 创建腾讯云COS存储桶

1. 访问 [腾讯云COS控制台](https://console.cloud.tencent.com/cos)
2. 点击"创建存储桶"
3. 填写存储桶配置：
   - **存储桶名称**: 例如 `my-blog-images-1234567890`（需要全局唯一）
   - **所属地域**: 建议选择就近地域，如：
     - `ap-beijing`（北京）
     - `ap-shanghai`（上海）
     - `ap-guangzhou`（广州）
   - **访问权限**: 选择"公有读私有写"
4. 点击"创建"

### 2. 获取API密钥

1. 访问 [API密钥管理](https://console.cloud.tencent.com/cam/capi)
2. 点击"新建密钥"
3. 记录下 `SecretId` 和 `SecretKey`

### 3. 配置环境变量

在项目根目录的 `.env` 文件中添加以下配置：

```env
# 腾讯云COS配置
TENCENT_COS_SECRET_ID=你的SecretId
TENCENT_COS_SECRET_KEY=你的SecretKey
TENCENT_COS_REGION=ap-beijing
TENCENT_COS_BUCKET=你的存储桶名称
TENCENT_COS_DOMAIN=https://你的存储桶名称.cos.ap-beijing.myqcloud.com
```

### 4. 配置示例

假设你的存储桶名称为 `my-blog-images-1234567890`，地域为北京，配置如下：

```env
TENCENT_COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_REGION=ap-beijing
TENCENT_COS_BUCKET=my-blog-images-1234567890
TENCENT_COS_DOMAIN=https://my-blog-images-1234567890.cos.ap-beijing.myqcloud.com
```

## 🎯 优化建议

### 1. 开启CDN加速（推荐）

1. 在COS控制台选择你的存储桶
2. 点击"域名与传输管理" > "默认CDN加速域名"
3. 开启CDN加速，获得更快的访问速度

如果开启了CDN，请将 `TENCENT_COS_DOMAIN` 改为CDN域名：
```env
TENCENT_COS_DOMAIN=https://你的CDN域名
```

### 2. 配置跨域规则

为了避免浏览器跨域问题，建议配置CORS：

1. 进入存储桶设置
2. 点击"安全管理" > "跨域访问CORS设置"
3. 添加规则：
   - **来源Origin**: `*` 或你的域名
   - **操作Methods**: `GET, POST, PUT, DELETE, HEAD`
   - **Allow-Headers**: `*`

### 3. 图片处理功能（可选）

腾讯云COS支持实时图片处理，可以通过URL参数实现：

- 缩放：`?imageMogr2/thumbnail/300x300`
- 质量压缩：`?imageMogr2/quality/80`
- 格式转换：`?imageMogr2/format/webp`

## 🔐 安全建议

### 1. 使用子账号密钥

不建议使用主账号密钥，建议创建子账号：

1. 访问 [访问管理控制台](https://console.cloud.tencent.com/cam)
2. 创建子用户
3. 授予COS相关权限
4. 使用子用户的密钥

### 2. 最小权限原则

子账号只需要以下权限：
- `cos:PutObject`（上传文件）
- `cos:GetObject`（读取文件）
- `cos:DeleteObject`（删除文件，可选）

## 🧪 测试配置

配置完成后，可以通过以下方式测试：

1. 重启开发服务器：`pnpm dev`
2. 登录管理后台
3. 创建或编辑文章
4. 在Markdown编辑器中上传图片
5. 检查图片是否正常显示

## ❓ 常见问题

### Q: 上传失败，提示权限错误
A: 检查以下几点：
- SecretId和SecretKey是否正确
- 存储桶名称是否正确
- 地域是否匹配
- 存储桶权限是否设置为"公有读私有写"

### Q: 图片无法显示
A: 检查以下几点：
- 存储桶是否设置为公有读
- `TENCENT_COS_DOMAIN` 是否正确
- Next.js配置中是否添加了COS域名

### Q: 如何查看用量和费用
A: 在COS控制台的"用量统计"中可以查看详细的用量情况

## 💰 费用说明

### 免费额度（每月）
- 标准存储容量：50GB
- 标准存储请求：10万次
- CDN回源流量：10GB

对于个人博客，免费额度通常完全够用！

---

**注意**: 请妥善保管你的API密钥，不要提交到代码仓库中！ 