import { ref } from 'vue'

const GITHUB_API = 'https://api.github.com'
const REPO_OWNER = 'Xiang-yu-Wang'
const REPO_NAME = '-------_202601221138_XY_Propose_Minutes'
const BRANCH = 'main'

// GitHub Personal Access Token (需要 repo 權限)
const token = ref<string>('')

// 從環境變數或 localStorage 讀取 token
const loadToken = () => {
  const stored = localStorage.getItem('github_token')
  if (stored) {
    token.value = stored
  }
  return token.value
}

// 儲存 token
const saveToken = (newToken: string) => {
  token.value = newToken
  localStorage.setItem('github_token', newToken)
}

// 清除 token
const clearToken = () => {
  token.value = ''
  localStorage.removeItem('github_token')
}

interface GitHubFile {
  sha: string
  content: string
}

// 取得檔案內容與 SHA
const getFileContent = async (path: string): Promise<GitHubFile | null> => {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
      {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      sha: data.sha,
      content: atob(data.content) // Base64 decode
    }
  } catch (error) {
    console.error('Failed to get file content:', error)
    return null
  }
}

// 更新檔案到 GitHub
const updateFile = async (
  path: string,
  content: string,
  message: string,
  sha: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          content: btoa(unescape(encodeURIComponent(content))), // UTF-8 to Base64
          sha,
          branch: BRANCH
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `GitHub API error: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Failed to update file:', error)
    throw error
  }
}

// 將 announcements 同步到 GitHub
const syncAnnouncementsToGitHub = async (announcements: any[]) => {
  const path = 'src/data/announcements.ts'
  
  // 產生 TypeScript 內容
  const content = `// 此檔案由管理後台自動產生，請勿手動編輯
export interface Announcement {
  id: number
  title: string
  date: string
  type: 'important' | 'new' | 'info'
  tags?: string[]
  content: string
}

export const announcements: Announcement[] = ${JSON.stringify(announcements, null, 2)}
`

  // 取得目前檔案的 SHA
  const file = await getFileContent(path)
  if (!file) {
    throw new Error('無法讀取目前檔案')
  }

  // 更新到 GitHub
  await updateFile(
    path,
    content,
    `chore: 更新公告資料 (${new Date().toISOString()})`,
    file.sha
  )
}

// 將 products 同步到 GitHub
const syncProductsToGitHub = async (products: any[]) => {
  const path = 'src/data/products.ts'
  
  // 產生 TypeScript 內容
  const content = `// 此檔案由管理後台自動產生，請勿手動編輯
export interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
  available: boolean
}

export const products: Product[] = ${JSON.stringify(products, null, 2)}
`

  // 取得目前檔案的 SHA
  const file = await getFileContent(path)
  if (!file) {
    throw new Error('無法讀取目前檔案')
  }

  // 更新到 GitHub
  await updateFile(
    path,
    content,
    `chore: 更新產品資料 (${new Date().toISOString()})`,
    file.sha
  )
}

// 將 deliveryPhotos 同步到 GitHub
const syncDeliveryPhotosToGitHub = async (deliveryPhotos: any[]) => {
  const path = 'src/data/deliveryPhotos.ts'
  
  // 產生 TypeScript 內容
  const content = `// 此檔案由管理後台自動產生，請勿手動編輯
// 交貨照照片數據
export interface DeliveryPhoto {
  id: string
  url: string
  title: string
  description: string
  date: string
  location: string
}

export const deliveryPhotos: DeliveryPhoto[] = ${JSON.stringify(deliveryPhotos, null, 2)}
`

  // 取得目前檔案的 SHA
  const file = await getFileContent(path)
  if (!file) {
    throw new Error('無法讀取目前檔案')
  }

  // 更新到 GitHub
  await updateFile(
    path,
    content,
    `chore: 更新交貨照資料 (${new Date().toISOString()})`,
    file.sha
  )
}

export function useGitHubSync() {
  return {
    token,
    loadToken,
    saveToken,
    clearToken,
    syncAnnouncementsToGitHub,
    syncProductsToGitHub,
    syncDeliveryPhotosToGitHub
  }
}
