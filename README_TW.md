# Security Learning Path - 資安學習路徑

一個資安學習路徑分享平台，使用 GitHub Issues 作為資料庫。

[English README](./README.md)

![Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 專案目標

整理 feifei.tw 網站的內容，做為更系統化的資安學習平台，衍生的資安學習路徑資料庫。為了補充資安學習資源，亦整理現有優質資安學習資源於學習路徑資料庫中。

## 功能特色

- **GitHub 驅動** - 使用 GitHub Issues 作為資料庫，無需後端
- **社群投稿** - 任何人都可以透過 GitHub Issue 表單投稿學習路徑
- **內建審核系統** - 在 GitHub 加上 label 即可審核投稿
- **難度等級** - 依初級、中級、高級篩選
- **學習資源** - 每個路徑包含相關文章與資源連結
- **前置知識** - 清楚說明所需的先備知識
- **預計時間** - 了解每個路徑需要多少時間
- **搜尋與篩選** - 依分類、標籤或關鍵字搜尋
- **響應式設計** - 支援桌面與手機瀏覽

## 運作方式

1. **投稿** - 使用者點擊「新增路徑」→ 開啟 GitHub Issue 表單
2. **審核** - 管理員審核 Issue 並加上 `approved` label
3. **顯示** - 網站自動顯示有 `approved` label 的 Issues

## 專案結構

```
security-path/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── path-submission.yml      # 中文投稿表單
│       └── path-submission-en.yml   # 英文投稿表單
├── index.html                       # 主頁面
├── security-path.css                # 樣式
├── security-path.js                 # 邏輯（GitHub API）
├── README.md                        # 英文文件
└── README_TW.md                     # 中文文件
```

## 設定

編輯 `security-path.js` 中的 GitHub 設定：

```javascript
const GITHUB_CONFIG = {
  owner: 'your-username',    // 你的 GitHub 用戶名
  repo: 'security-path',     // Repository 名稱
  label: 'approved'          // 已審核路徑的 label
};
```

## Label 系統

| Label | 用途 |
|-------|------|
| `pending` | 新投稿（預設） |
| `approved` | 已審核，會顯示在網站上 |

## 分類

- **網路安全** - TCP/IP、防火牆、VPN、IDS/IPS
- **滲透測試** - Kali Linux、Metasploit、OSCP
- **Web安全** - OWASP Top 10、XSS、SQL Injection
- **密碼學** - 加密、PKI、TLS/SSL
- **惡意程式分析** - 逆向工程、IDA Pro、Ghidra
- **雲端安全** - AWS、Azure、GCP、Kubernetes

## 部署方式

### GitHub Pages

1. 前往 repository **Settings** → **Pages**
2. 設定 source 為 **main branch**
3. 網站將上線於 `https://path.feifei.tw`

### 其他平台

將靜態檔案部署到任何託管服務即可（Netlify、Vercel 等）

## 授權

GNU General Public License v3.0
