/**
 * 腾讯云COS连接测试脚本
 * 用法: node scripts/test-cos.js
 */

require('dotenv').config()
const COS = require('cos-nodejs-sdk-v5')

// 检查环境变量
const requiredEnvs = [
  'TENCENT_COS_SECRET_ID',
  'TENCENT_COS_SECRET_KEY',
  'TENCENT_COS_REGION',
  'TENCENT_COS_BUCKET',
]

console.log('🔍 检查环境变量...')
const missingEnvs = requiredEnvs.filter(env => !process.env[env])

if (missingEnvs.length > 0) {
  console.error('❌ 缺少必要的环境变量:')
  missingEnvs.forEach(env => console.error(`   - ${env}`))
  console.log('\n请在 .env 文件中配置这些变量，参考 docs/COS_SETUP_GUIDE.md')
  process.exit(1)
}

console.log('✅ 环境变量检查通过')

// 创建COS实例
const cos = new COS({
  SecretId: process.env.TENCENT_COS_SECRET_ID,
  SecretKey: process.env.TENCENT_COS_SECRET_KEY,
})

async function testConnection() {
  try {
    console.log('🔗 测试COS连接...')

    // 测试存储桶是否存在
    const result = await cos.headBucket({
      Bucket: process.env.TENCENT_COS_BUCKET,
      Region: process.env.TENCENT_COS_REGION,
    })

    console.log('✅ COS连接成功!')
    console.log('📋 存储桶信息:')
    console.log(`   - 名称: ${process.env.TENCENT_COS_BUCKET}`)
    console.log(`   - 地域: ${process.env.TENCENT_COS_REGION}`)
    console.log(`   - 域名: ${process.env.TENCENT_COS_DOMAIN}`)

    // 测试上传权限（创建一个测试文件）
    console.log('\n🧪 测试上传权限...')
    const testKey = 'test/connection-test.txt'
    const testContent = `COS连接测试 - ${new Date().toISOString()}`

    await cos.putObject({
      Bucket: process.env.TENCENT_COS_BUCKET,
      Region: process.env.TENCENT_COS_REGION,
      Key: testKey,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    })

    console.log('✅ 上传权限测试通过')

    // 清理测试文件
    await cos.deleteObject({
      Bucket: process.env.TENCENT_COS_BUCKET,
      Region: process.env.TENCENT_COS_REGION,
      Key: testKey,
    })

    console.log('✅ 清理测试文件完成')
    console.log('\n🎉 COS配置完全正常，可以开始使用了!')
  }
  catch (error) {
    console.error('❌ COS连接测试失败:')
    console.error('错误信息:', error.message)

    if (error.statusCode === 403) {
      console.log('\n💡 可能的解决方案:')
      console.log('   1. 检查SecretId和SecretKey是否正确')
      console.log('   2. 检查存储桶名称是否正确')
      console.log('   3. 确保API密钥有COS操作权限')
    }
    else if (error.statusCode === 404) {
      console.log('\n💡 可能的解决方案:')
      console.log('   1. 检查存储桶名称是否正确')
      console.log('   2. 检查地域配置是否正确')
      console.log('   3. 确保存储桶已创建')
    }

    process.exit(1)
  }
}

testConnection()
