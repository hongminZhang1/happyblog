// eslint-disable-next-line @typescript-eslint/no-require-imports
const COS = require('cos-nodejs-sdk-v5')
import path from 'path'

// COS配置
const cos = new COS({
  SecretId: process.env.TENCENT_COS_SECRET_ID!,
  SecretKey: process.env.TENCENT_COS_SECRET_KEY!,
})

// 环境变量
const BUCKET = process.env.TENCENT_COS_BUCKET!
const REGION = process.env.TENCENT_COS_REGION!
const DOMAIN = process.env.TENCENT_COS_DOMAIN!

/**
 * 上传文件到腾讯云COS
 */
export async function uploadToCOS(file: Buffer, fileName: string): Promise<string> {
  try {
    // 生成唯一文件名（避免中文字符）
    const timestamp = Date.now()
    const ext = path.extname(fileName)
    const randomStr = Math.random().toString(36).substring(2)
    const uniqueFileName = `blog-images/${timestamp}_${randomStr}${ext}`

    console.log('🔧 COS上传调试信息:')
    console.log('   - 存储桶:', BUCKET)
    console.log('   - 地域:', REGION)
    console.log('   - 文件名:', uniqueFileName)
    console.log('   - 域名:', DOMAIN)

    const result = await cos.putObject({
      Bucket: BUCKET,
      Region: REGION,
      Key: uniqueFileName,
      Body: file,
      ContentType: getContentType(ext),
      // 设置Content-Disposition为inline，让浏览器预览而不是下载
      ContentDisposition: 'inline',
      // 设置缓存控制
      CacheControl: 'max-age=31536000',
      // 设置元数据
      Metadata: {
        'original-name': fileName,
        'upload-time': new Date().toISOString(),
      }
    })

    const finalUrl = `${DOMAIN}/${uniqueFileName}`
    
    console.log('✅ COS上传成功!')
    console.log('   - 返回的URL:', finalUrl)
    console.log('   - 上传结果:', result)
    
    // 返回完整的文件URL
    return finalUrl
  } catch (error) {
    console.error('❌ COS上传失败:', error)
    throw new Error('文件上传失败')
  }
}

/**
 * 从COS删除文件
 */
export async function deleteFromCOS(fileUrl: string): Promise<boolean> {
  try {
    // 从URL中提取文件key
    const url = new URL(fileUrl)
    const key = url.pathname.substring(1) // 移除开头的'/'

    await cos.deleteObject({
      Bucket: BUCKET,
      Region: REGION,
      Key: key,
    })

    return true
  } catch (error) {
    console.error('COS删除失败:', error)
    return false
  }
}

/**
 * 获取文件的Content-Type
 */
function getContentType(ext: string): string {
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  return types[ext.toLowerCase()] || 'application/octet-stream'
}

/**
 * 验证文件类型
 */
export function isValidImageType(fileName: string): boolean {
  const validExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const ext = path.extname(fileName).toLowerCase()
  return validExts.includes(ext)
}

/**
 * 验证文件大小（4MB限制）
 */
export function isValidFileSize(fileSize: number): boolean {
  const maxSize = 4 * 1024 * 1024 // 4MB
  return fileSize <= maxSize
}

/**
 * 生成COS签名URL（可选，用于私有读取）
 */
export async function generateSignedUrl(key: string, expires = 3600): Promise<string> {
  try {
    const url = cos.getObjectUrl({
      Bucket: BUCKET,
      Region: REGION,
      Key: key,
      Sign: true,
      Expires: expires,
    })
    
    return url
  } catch (error) {
    console.error('生成签名URL失败:', error)
    throw new Error('生成签名URL失败')
  }
} 