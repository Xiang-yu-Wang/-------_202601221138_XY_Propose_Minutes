/**
 * SEO 靜態檔案生成器
 * 用於在構建時生成 robots.txt 和 sitemap.xml
 * 
 * 使用方式：在 package.json 的 build 指令前執行此腳本
 * "prebuild": "bun scripts/generate-seo-files.js"
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 讀取 .env.production 檔案
function loadProductionEnv() {
  const envPath = resolve(__dirname, '../.env.production')
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8')
    const match = envContent.match(/VITE_SEO_URL=(.+)/)
    if (match) {
      return match[1].trim()
    }
  }
  return null
}

// 從環境變數或 .env.production 讀取域名
const baseURL = process.env.VITE_SEO_URL || loadProductionEnv() || 'https://example.com'

// 所有網站頁面
const pages = [
  '/',
  '/#/services',
  '/#/plans',
  '/#/gallery',
  '/#/announcements',
  '/#/products',
  '/#/recruitment',
  '/#/community',
  '/#/contact',
  '/#/upload',
]

// 生成 sitemap.xml
function generateSitemap() {
  const urls = pages
    .map(
      (page) => `
  <url>
    <loc>${baseURL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  const publicDir = resolve(__dirname, '../public')
  writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap)
  console.log(`✅ 已生成 sitemap.xml (域名: ${baseURL})`)
}

// 生成 robots.txt
function generateRobots() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${baseURL}/sitemap.xml

# 尊重 robots.txt，避免過度爬蟲
User-agent: *
Crawl-delay: 1
`

  const publicDir = resolve(__dirname, '../public')
  writeFileSync(resolve(publicDir, 'robots.txt'), robots)
  console.log(`✅ 已生成 robots.txt (域名: ${baseURL})`)
}

// 執行生成
try {
  generateSitemap()
  generateRobots()
  console.log(`\n✅ SEO 檔案生成完成！`)
  console.log(`   使用域名: ${baseURL}`)
  console.log(`   提示: 修改 .env.production 以更新生產環境域名\n`)
} catch (error) {
  console.error('❌ SEO 檔案生成失敗:', error)
  process.exit(1)
}

