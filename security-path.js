/**
 * Security Learning Path
 * A cybersecurity learning roadmap platform powered by GitHub Issues
 */

// ==========================================
// Configuration
// ==========================================
const GITHUB_CONFIG = {
  owner: 'fei3363',
  repo: 'security-path',
  label: 'approved'
};

// ==========================================
// State
// ==========================================
let currentLang = localStorage.getItem('lang') || 'zh-TW';
let paths = [];
let filteredPaths = [];
let currentCategory = 'all';
let currentDifficulty = 'all';
let searchQuery = '';
let currentView = 'grid';
let categories = new Map(); // Dynamic categories

// ==========================================
// i18n
// ==========================================
const i18n = {
  'zh-TW': {
    searchPlaceholder: '搜尋學習路徑...',
    addPath: '新增路徑',
    all: '全部',
    paths: '學習路徑',
    favorites: '收藏',
    resources: '學習資源',
    loading: '載入中...',
    noPaths: '還沒有學習路徑',
    noPathsHint: '點擊「新增路徑」分享你的資安學習經驗',
    addFirstPath: '+ 新增第一個學習路徑',
    noResults: '找不到相關路徑',
    noResultsHint: '試試其他關鍵字或分類',
    featuredCourses: '推薦課程',
    viewAll: '查看全部 →',
    share: '分享連結',
    favorite: '收藏',
    edit: '編輯',
    reply: '回應',
    delete: '刪除',
    prerequisites: '📋 前置知識',
    objectives: '🎯 學習目標',
    resourcesTitle: '📚 相關文章與資源',
    copied: '已複製！',
    issueTemplate: 'path-submission.yml'
  },
  'en': {
    searchPlaceholder: 'Search learning paths...',
    addPath: 'Add Path',
    all: 'All',
    paths: 'Paths',
    favorites: 'Favorites',
    resources: 'Resources',
    loading: 'Loading...',
    noPaths: 'No learning paths yet',
    noPathsHint: 'Click "Add Path" to share your experience',
    addFirstPath: '+ Add First Path',
    noResults: 'No results found',
    noResultsHint: 'Try different keywords or categories',
    featuredCourses: 'Featured Courses',
    viewAll: 'View All →',
    share: 'Share Link',
    favorite: 'Favorite',
    edit: 'Edit',
    reply: 'Reply',
    delete: 'Delete',
    prerequisites: '📋 Prerequisites',
    objectives: '🎯 Learning Objectives',
    resourcesTitle: '📚 Related Resources',
    copied: 'Copied!',
    issueTemplate: 'path-submission-en.yml'
  }
};

function t(key) {
  return i18n[currentLang]?.[key] || i18n['zh-TW'][key] || key;
}

// ==========================================
// Category & Difficulty Helpers
// ==========================================
const categoryMap = {
  '網路安全': 'network', 'Network Security': 'network',
  '滲透測試': 'pentest', 'Penetration Testing': 'pentest',
  'Web安全': 'web', 'Web Security': 'web',
  '密碼學': 'crypto', 'Cryptography': 'crypto',
  '惡意程式分析': 'malware', 'Malware Analysis': 'malware',
  '雲端安全': 'cloud', 'Cloud Security': 'cloud'
};

const categoryIcons = {
  'network': '🌐', 'pentest': '🔓', 'web': '🕸️',
  'crypto': '🔐', 'malware': '🦠', 'cloud': '☁️'
};

const categoryLabels = {
  'network': { zh: '網路安全', en: 'Network' },
  'pentest': { zh: '滲透測試', en: 'Pentest' },
  'web': { zh: 'Web安全', en: 'Web Security' },
  'crypto': { zh: '密碼學', en: 'Crypto' },
  'malware': { zh: '惡意程式', en: 'Malware' },
  'cloud': { zh: '雲端安全', en: 'Cloud' }
};

const difficultyMap = {
  '初級': 'beginner', 'Beginner': 'beginner',
  '中級': 'intermediate', 'Intermediate': 'intermediate',
  '高級': 'advanced', 'Advanced': 'advanced'
};

const difficultyStyles = {
  'beginner': { bg: 'bg-green-100', text: 'text-green-800', label: { zh: '🟢 初級', en: '🟢 Beginner' } },
  'intermediate': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: { zh: '🟡 中級', en: '🟡 Intermediate' } },
  'advanced': { bg: 'bg-red-100', text: 'text-red-800', label: { zh: '🔴 高級', en: '🔴 Advanced' } }
};

function getCategoryLabel(key) {
  return categoryLabels[key]?.[currentLang === 'en' ? 'en' : 'zh'] || key;
}

function getDifficultyLabel(key) {
  return difficultyStyles[key]?.label[currentLang === 'en' ? 'en' : 'zh'] || key;
}

// ==========================================
// Sample Data (shown when no GitHub data)
// ==========================================
const samplePaths = [
  {
    id: 1,
    title: 'Web 滲透測試入門',
    objectives: '學習 OWASP Top 10 漏洞原理與實作，包含 SQL Injection、XSS、CSRF 等常見攻擊手法，並了解如何進行安全測試與修補建議。',
    category: 'web',
    categoryName: 'Web安全',
    difficulty: 'beginner',
    estimatedTime: '40 小時',
    prerequisites: '基礎 HTML/CSS/JavaScript 知識、HTTP 協定基本概念',
    resources: ['https://owasp.org/www-project-top-ten/', 'https://portswigger.net/web-security'],
    tags: ['OWASP', 'SQLi', 'XSS', 'Web Security'],
    images: [],
    author: 'feifei',
    authorUrl: 'https://feifei.tw',
    reactions: 42,
    url: 'https://github.com/fei3363/security-path/issues',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Linux 滲透測試基礎',
    objectives: '從零開始學習 Linux 系統安全，包含權限提升、服務漏洞利用、後滲透技巧，為 OSCP 等認證考試打下基礎。',
    category: 'pentest',
    categoryName: '滲透測試',
    difficulty: 'intermediate',
    estimatedTime: '60 小時',
    prerequisites: 'Linux 基本操作、網路基礎概念',
    resources: ['https://www.hackthebox.com/', 'https://tryhackme.com/'],
    tags: ['Linux', 'PrivEsc', 'OSCP', 'HackTheBox'],
    images: [],
    author: 'feifei',
    authorUrl: 'https://feifei.tw',
    reactions: 38,
    url: 'https://github.com/fei3363/security-path/issues',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: '網路封包分析實戰',
    objectives: '使用 Wireshark 進行網路流量分析，學習識別惡意流量、網路攻擊偵測、以及 CTF 網路題目解題技巧。',
    category: 'network',
    categoryName: '網路安全',
    difficulty: 'beginner',
    estimatedTime: '25 小時',
    prerequisites: 'TCP/IP 基本概念',
    resources: ['https://www.wireshark.org/', 'https://www.malware-traffic-analysis.net/'],
    tags: ['Wireshark', 'PCAP', 'Network', 'CTF'],
    images: [],
    author: 'feifei',
    authorUrl: 'https://feifei.tw',
    reactions: 25,
    url: 'https://github.com/fei3363/security-path/issues',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: '密碼學基礎與應用',
    objectives: '了解對稱/非對稱加密、雜湊函數、數位簽章等密碼學原理，並學習如何在 CTF 中破解各種加密挑戰。',
    category: 'crypto',
    categoryName: '密碼學',
    difficulty: 'intermediate',
    estimatedTime: '35 小時',
    prerequisites: '基礎數學概念、程式設計基礎',
    resources: ['https://cryptohack.org/', 'https://cryptopals.com/'],
    tags: ['AES', 'RSA', 'Hash', 'CTF'],
    images: [],
    author: 'feifei',
    authorUrl: 'https://feifei.tw',
    reactions: 30,
    url: 'https://github.com/fei3363/security-path/issues',
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: '惡意程式分析入門',
    objectives: '學習靜態與動態惡意程式分析技術，使用 IDA Pro、Ghidra、x64dbg 等工具進行逆向工程與行為分析。',
    category: 'malware',
    categoryName: '惡意程式分析',
    difficulty: 'advanced',
    estimatedTime: '80 小時',
    prerequisites: '組合語言基礎、Windows/Linux 系統原理',
    resources: ['https://malwareunicorn.org/', 'https://www.youtubesafe.com/watch?v=dQw4w9WgXcQ'],
    tags: ['Reverse', 'Malware', 'IDA', 'Ghidra'],
    images: [],
    author: 'feifei',
    authorUrl: 'https://feifei.tw',
    reactions: 45,
    url: 'https://github.com/fei3363/security-path/issues',
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    title: 'AWS 雲端安全實務',
    objectives: '學習 AWS 雲端環境的安全設定、IAM 權限管理、S3 安全配置、以及常見雲端漏洞的識別與防護。',
    category: 'cloud',
    categoryName: '雲端安全',
    difficulty: 'intermediate',
    estimatedTime: '45 小時',
    prerequisites: 'AWS 基本服務概念',
    resources: ['https://aws.amazon.com/tw/security/', 'https://cloudsecwiki.com/'],
    tags: ['AWS', 'IAM', 'S3', 'Cloud'],
    images: [],
    author: 'feifei',
    authorUrl: 'https://feifei.tw',
    reactions: 28,
    url: 'https://github.com/fei3363/security-path/issues',
    createdAt: new Date().toISOString()
  }
];

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Configure marked.js to open links in new tab
  const renderer = new marked.Renderer();
  renderer.link = function(href, title, text) {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
  };
  marked.setOptions({ renderer });

  initEventListeners();
  updateUILanguage();
  loadPaths();
  loadCourses();

  // Listen for hash changes
  window.addEventListener('hashchange', checkUrlHash);
});

function checkUrlHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#path-')) {
    const pathId = parseInt(hash.replace('#path-', ''));
    if (pathId && paths.length > 0) {
      openDetailModal(pathId);
    }
  }
}

function initEventListeners() {
  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterAndRender();
    }, 300));

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') {
        searchInput.blur();
      }
    });
  }

  // Add path button
  document.getElementById('add-btn')?.addEventListener('click', openSubmitPage);

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      const container = document.getElementById('paths-container');
      container.classList.toggle('list-view', currentView === 'list');
    });
  });

  // Difficulty filter
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDifficulty = btn.dataset.level;
      filterAndRender();
    });
  });

  // Detail modal close
  document.getElementById('detail-close')?.addEventListener('click', closeDetailModal);
  document.getElementById('detail-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'detail-overlay') closeDetailModal();
  });

  // Lightbox
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-overlay') closeLightbox();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailModal();
      closeLightbox();
    }
  });
}

// ==========================================
// Data Loading
// ==========================================
async function loadPaths() {
  const loadingState = document.getElementById('loading-state');
  const container = document.getElementById('paths-container');

  const showPaths = () => {
    // Always ensure we have data - use sample if empty
    if (paths.length === 0) {
      paths = [...samplePaths];
    }
    buildCategories();
    loadingState.style.display = 'none';
    container.style.display = 'grid';
    filterAndRender();
    updateStats();

    // Check URL hash after paths are loaded
    checkUrlHash();
  };

  try {
    const { owner, repo, label } = GITHUB_CONFIG;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${label}&state=open&per_page=100`;

    const response = await fetch(url);
    if (response.ok) {
      const issues = await response.json();
      paths = issues.map(parseIssuePath).filter(Boolean);
    }
    showPaths();
  } catch (error) {
    console.error('Failed to load paths:', error);
    showPaths();
  }
}

function parseIssuePath(issue) {
  try {
    const body = issue.body || '';

    // All form field headers (used to detect section boundaries)
    const formFields = [
      '路徑名稱', 'Path Name',
      '分類', 'Category',
      '難度等級', 'Difficulty Level',
      '預計學習時間', 'Estimated Time',
      '詳細內容', 'Description', '學習目標', 'Learning Objectives',
      '前置知識', 'Prerequisites',
      '資源連結', 'Resource Links',
      '標籤', 'Tags',
      '預覽圖片（選填）', 'Preview Image',
      '作者名稱（選填）', 'Author Name',
      '作者網站（選填）', 'Author Website'
    ];
    const fieldPattern = formFields.map(f => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

    const getValue = (zh, en) => {
      const regex = new RegExp(`### (?:${zh}|${en})\\s*\\n([\\s\\S]*?)(?=\\n### (?:${fieldPattern})|$)`, 'i');
      const match = body.match(regex);
      return match ? match[1].trim() : '';
    };

    const title = getValue('路徑名稱', 'Path Name') || issue.title.replace('[Path]', '').trim();
    const objectives = getValue('詳細內容', 'Description') || getValue('學習目標', 'Learning Objectives');
    const categoryName = getValue('分類', 'Category');
    const difficultyName = getValue('難度等級', 'Difficulty Level');
    const estimatedTime = getValue('預計學習時間', 'Estimated Time');
    const prerequisites = getValue('前置知識', 'Prerequisites');
    const resourcesStr = getValue('資源連結', 'Resource Links');
    const tagsStr = getValue('標籤', 'Tags');
    const imageContent = getValue('預覽圖片（選填）', 'Preview Image');
    const author = getValue('作者名稱（選填）', 'Author Name');
    const authorUrl = getValue('作者網站（選填）', 'Author Website');

    if (!title) return null;

    // Parse category - support custom categories
    let category = categoryMap[categoryName];
    if (!category && categoryName) {
      // Custom category
      category = categoryName.toLowerCase().replace(/\s+/g, '-');
    }
    category = category || 'other';

    const difficulty = difficultyMap[difficultyName] || 'beginner';
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
    const resources = resourcesStr ? resourcesStr.split('\n').filter(r => r.trim().startsWith('http')) : [];

    // Parse images
    let images = [];
    if (imageContent) {
      const imgRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
      let match;
      while ((match = imgRegex.exec(imageContent)) !== null) {
        images.push(match[1]);
      }
    }

    return {
      id: issue.number,
      title,
      objectives,
      category,
      categoryName: categoryName || category,
      difficulty,
      estimatedTime,
      prerequisites,
      resources,
      tags,
      images,
      author,
      authorUrl,
      reactions: issue.reactions?.total_count || 0,
      url: issue.html_url,
      createdAt: issue.created_at
    };
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }
}

// ==========================================
// Dynamic Categories
// ==========================================
function buildCategories() {
  categories.clear();

  paths.forEach(path => {
    const key = path.category;
    if (!categories.has(key)) {
      categories.set(key, {
        key,
        name: path.categoryName,
        icon: categoryIcons[key] || '📁',
        count: 0
      });
    }
    categories.get(key).count++;
  });

  renderCategories();
}

function renderCategories() {
  const container = document.getElementById('category-pills');
  if (!container) return;

  // Keep the "All" button
  const allBtn = container.querySelector('[data-category="all"]');
  container.innerHTML = '';
  if (allBtn) container.appendChild(allBtn);

  // Add dynamic category buttons
  categories.forEach((cat, key) => {
    const btn = document.createElement('button');
    btn.className = 'pill flex items-center gap-2 px-4 py-2 bg-brown-100 text-brown-700 rounded-full text-sm font-medium whitespace-nowrap transition';
    btn.dataset.category = key;
    btn.innerHTML = `<span>${cat.icon}</span><span>${getCategoryLabel(key) || cat.name}</span><span class="text-xs opacity-60">(${cat.count})</span>`;
    btn.addEventListener('click', () => selectCategory(key));
    container.appendChild(btn);
  });

  // Re-attach all button listener
  allBtn?.addEventListener('click', () => selectCategory('all'));
}

function selectCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  filterAndRender();
}

// ==========================================
// Filtering & Rendering
// ==========================================
function filterAndRender() {
  filteredPaths = paths.filter(path => {
    // Category filter
    if (currentCategory !== 'all' && path.category !== currentCategory) return false;

    // Difficulty filter
    if (currentDifficulty !== 'all' && path.difficulty !== currentDifficulty) return false;

    // Search filter
    if (searchQuery) {
      const searchText = `${path.title} ${path.objectives} ${path.tags.join(' ')} ${path.categoryName}`.toLowerCase();
      if (!searchText.includes(searchQuery)) return false;
    }

    return true;
  });

  renderPaths();
}

function renderPaths() {
  const container = document.getElementById('paths-container');
  const noResults = document.getElementById('no-results');
  const emptyState = document.getElementById('empty-state');

  if (filteredPaths.length === 0) {
    container.style.display = 'none';
    if (paths.length === 0) {
      emptyState.style.display = 'flex';
      noResults.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      noResults.style.display = 'flex';
    }
    return;
  }

  emptyState.style.display = 'none';
  noResults.style.display = 'none';
  container.style.display = 'grid';

  container.innerHTML = filteredPaths.map(path => renderPathCard(path)).join('');

  // Add click listeners
  container.querySelectorAll('.path-card').forEach(card => {
    card.addEventListener('click', () => openDetailModal(parseInt(card.dataset.id)));
  });
}

function renderPathCard(path) {
  const diffStyle = difficultyStyles[path.difficulty] || difficultyStyles.beginner;
  const imageUrl = path.images[0] ? `https://wsrv.nl/?url=${encodeURIComponent(path.images[0])}&w=400&q=80` : '';
  const isFavorited = getFavorites().includes(path.id);

  return `
    <div class="path-card bg-white rounded-2xl border border-brown-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:border-brown-300" data-id="${path.id}">
      <div class="relative h-40 bg-brown-100 flex items-center justify-center overflow-hidden">
        ${imageUrl
          ? `<img src="${imageUrl}" alt="${path.title}" class="w-full h-full object-cover" loading="lazy">`
          : `<span class="text-5xl">${categoryIcons[path.category] || '🛡️'}</span>`
        }
        <div class="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-brown-700">
          ${categoryIcons[path.category] || '📁'} ${getCategoryLabel(path.category) || path.categoryName}
        </div>
        ${path.estimatedTime ? `
          <div class="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-mono text-brown-600">
            ⏱️ ${path.estimatedTime}
          </div>
        ` : ''}
        <button class="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-sm transition hover:bg-red-100 ${isFavorited ? 'text-red-500' : 'text-brown-400'}" onclick="event.stopPropagation(); toggleFavorite(${path.id})">
          ${isFavorited ? '♥' : '♡'}
        </button>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-0.5 ${diffStyle.bg} ${diffStyle.text} text-xs font-medium rounded-full">
            ${getDifficultyLabel(path.difficulty)}
          </span>
          ${path.reactions > 0 ? `<span class="text-xs text-brown-400">👍 ${path.reactions}</span>` : ''}
        </div>
        <h3 class="font-semibold text-brown-900 mb-2 line-clamp-2">${path.title}</h3>
        <p class="text-sm text-brown-500 line-clamp-2">${stripMarkdown(path.objectives)?.substring(0, 100) || ''}</p>
        ${path.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1 mt-3">
            ${path.tags.slice(0, 3).map(tag => `<span class="px-2 py-0.5 bg-brown-100 text-brown-600 text-xs rounded-full">${tag}</span>`).join('')}
            ${path.tags.length > 3 ? `<span class="text-xs text-brown-400">+${path.tags.length - 3}</span>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ==========================================
// Detail Modal
// ==========================================
function openDetailModal(id) {
  const path = paths.find(p => p.id === id);
  if (!path) return;

  const overlay = document.getElementById('detail-overlay');
  const diffStyle = difficultyStyles[path.difficulty] || difficultyStyles.beginner;

  // Update content
  document.getElementById('detail-category').textContent = `${categoryIcons[path.category] || '📁'} ${getCategoryLabel(path.category) || path.categoryName}`;
  document.getElementById('detail-difficulty').className = `px-3 py-1 ${diffStyle.bg} ${diffStyle.text} text-xs font-semibold rounded-full`;
  document.getElementById('detail-difficulty').textContent = getDifficultyLabel(path.difficulty);
  document.getElementById('detail-time').textContent = path.estimatedTime ? `⏱️ ${path.estimatedTime}` : '';
  document.getElementById('detail-title').textContent = path.title;
  document.getElementById('detail-author').textContent = path.author ? `by ${path.author}` : '';
  document.getElementById('detail-objectives').innerHTML = path.objectives ? marked.parse(path.objectives) : '';

  // Prerequisites
  const prereqEl = document.getElementById('detail-prerequisites');
  if (path.prerequisites) {
    prereqEl.style.display = 'block';
    document.getElementById('detail-prerequisites-text').textContent = path.prerequisites;
  } else {
    prereqEl.style.display = 'none';
  }

  // Resources
  const resourcesList = document.getElementById('detail-resources-list');
  if (path.resources.length > 0) {
    document.getElementById('detail-resources').style.display = 'block';
    resourcesList.innerHTML = path.resources.map(url => `
      <a href="${url}" target="_blank" class="flex items-center gap-2 text-sm text-brown-600 hover:text-brown-900 py-1 border-b border-brown-100 last:border-0">
        <span>🔗</span>
        <span class="truncate">${url}</span>
      </a>
    `).join('');
  } else {
    document.getElementById('detail-resources').style.display = 'none';
  }

  // Tags
  document.getElementById('detail-tags').innerHTML = path.tags.map(tag =>
    `<span class="px-3 py-1 bg-brown-100 text-brown-600 text-sm rounded-full">${tag}</span>`
  ).join('');

  // Image
  const imageContainer = document.getElementById('detail-image');
  if (path.images.length > 0) {
    imageContainer.innerHTML = `<img src="${path.images[0]}" alt="${path.title}" class="max-w-full max-h-48 object-contain rounded-lg cursor-pointer" onclick="openLightbox('${path.images[0]}')">`;
  } else {
    imageContainer.innerHTML = `<div class="text-6xl">${categoryIcons[path.category] || '🛡️'}</div>`;
  }

  // Actions
  const isFavorited = getFavorites().includes(path.id);
  document.getElementById('detail-favorite').querySelector('.heart').textContent = isFavorited ? '♥' : '♡';
  document.getElementById('detail-favorite').onclick = () => toggleFavorite(path.id);
  document.getElementById('detail-edit').onclick = () => window.open(path.url, '_blank');
  document.getElementById('detail-reply').onclick = () => window.open(path.url, '_blank');
  document.getElementById('detail-delete').onclick = () => window.open(path.url, '_blank');

  // Share button
  document.getElementById('detail-share').onclick = () => copyShareLink(path.id);

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Update URL hash
  history.pushState(null, '', `#path-${path.id}`);
}

function closeDetailModal() {
  document.getElementById('detail-overlay')?.classList.remove('active');
  document.body.style.overflow = '';

  // Remove URL hash
  history.pushState(null, '', window.location.pathname);
}

function copyShareLink(pathId) {
  const url = `${window.location.origin}${window.location.pathname}#path-${pathId}`;

  // Try modern clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(() => {
      showToast(currentLang === 'en' ? 'Link copied!' : '已複製連結！');
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand('copy');
    showToast(currentLang === 'en' ? 'Link copied!' : '已複製連結！');
  } catch (err) {
    // If copy fails, show the URL in a prompt
    prompt(currentLang === 'en' ? 'Copy this link:' : '請複製此連結：', text);
  }

  document.body.removeChild(textarea);
}

// ==========================================
// Lightbox
// ==========================================
function openLightbox(imageUrl) {
  const overlay = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-image');
  img.src = imageUrl;
  overlay.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox-overlay')?.classList.remove('active');
}

// ==========================================
// Favorites
// ==========================================
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(id) {
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderPaths();
  updateStats();
  showToast(favorites.includes(id) ? '已加入收藏' : '已取消收藏');
}

// ==========================================
// Stats
// ==========================================
function updateStats() {
  document.getElementById('total-paths').textContent = paths.length;
  document.getElementById('total-favorites').textContent = getFavorites().length;

  const totalResources = paths.reduce((sum, p) => sum + p.resources.length, 0);
  document.getElementById('total-resources').textContent = totalResources;
}

// ==========================================
// UI Language
// ==========================================
function toggleLanguage() {
  currentLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
  localStorage.setItem('lang', currentLang);
  updateUILanguage();
  renderCategories();
  renderPaths();
}

function updateUILanguage() {
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const langBtn = document.getElementById('lang-btn');
  if (langBtn) langBtn.textContent = currentLang === 'zh-TW' ? 'EN' : '中';

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.setAttribute('placeholder', t('searchPlaceholder'));

  setText('add-btn-text', t('addPath'));
  setText('cat-all-text', t('all'));
  setText('diff-all', t('all'));
  setText('stat-paths-label', t('paths'));
  setText('stat-favorites-label', t('favorites'));
  setText('stat-resources-label', t('resources'));
  setText('loading-text', t('loading'));
  setText('empty-title', t('noPaths'));
  setText('empty-hint', t('noPathsHint'));
  setText('empty-add-btn', t('addFirstPath'));
  setText('no-results-title', t('noResults'));
  setText('no-results-hint', t('noResultsHint'));
  setText('courses-title-text', t('featuredCourses'));
  setText('view-all-btn', t('viewAll'));
  setText('share-text', t('share'));
}

// ==========================================
// Submit Page
// ==========================================
function openSubmitPage() {
  const { owner, repo } = GITHUB_CONFIG;
  const template = t('issueTemplate');
  window.open(`https://github.com/${owner}/${repo}/issues/new?template=${template}`, '_blank');
}

// ==========================================
// Toast
// ==========================================
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ==========================================
// Courses (from GitHub Issues)
// ==========================================
async function loadCourses() {
  const section = document.getElementById('featured-courses');
  const list = document.getElementById('courses-list');

  try {
    const { owner, repo } = GITHUB_CONFIG;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=course,approved&state=open&per_page=20`;
    const response = await fetch(url);
    if (!response.ok) return;

    const issues = await response.json();
    const courses = issues.map(parseCourse).filter(Boolean);

    if (courses.length === 0) return;

    section.style.display = 'block';
    list.innerHTML = courses.map(renderCourseCard).join('');

    // Carousel navigation
    const carousel = document.getElementById('courses-carousel');
    document.getElementById('carousel-prev')?.addEventListener('click', () => {
      carousel.scrollBy({ left: -220, behavior: 'smooth' });
    });
    document.getElementById('carousel-next')?.addEventListener('click', () => {
      carousel.scrollBy({ left: 220, behavior: 'smooth' });
    });
  } catch (e) {
    console.error('Failed to load courses:', e);
  }
}

function parseCourse(issue) {
  const body = issue.body || '';

  const getValue = (zh, en) => {
    const regex = new RegExp(`### (?:${zh}|${en})\\s*\\n([\\s\\S]*?)(?=\\n###|$)`, 'i');
    const match = body.match(regex);
    return match ? match[1].trim() : '';
  };

  const title = getValue('課程名稱', 'Course Name') || issue.title.replace('[Course]', '').trim();
  const url = getValue('課程連結', 'Course URL');
  const badge = getValue('標籤類型', 'Badge Type');
  const priceOriginal = getValue('原價（選填）', 'Original Price');
  const priceSale = getValue('售價', 'Current Price');
  const imageContent = getValue('課程圖片', 'Course Image');

  let image = '';
  const imgMatch = imageContent.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (imgMatch) image = imgMatch[1];

  if (!title || !url || !image) return null;

  return { id: issue.number, title, url, badge, priceOriginal, priceSale, image };
}

function renderCourseCard(course) {
  const badgeMap = {
    '特價': 'bg-red-500', 'Sale': 'bg-red-500',
    '免費': 'bg-green-500', 'Free': 'bg-green-500',
    '新課程': 'bg-blue-500', 'New': 'bg-blue-500',
    '熱門': 'bg-orange-500', 'Hot': 'bg-orange-500'
  };
  const badgeClass = badgeMap[course.badge] || '';

  return `
    <a href="${course.url}" target="_blank" class="course-card flex-shrink-0 w-48 bg-white rounded-xl border border-brown-200 overflow-hidden shadow-sm hover:shadow-lg">
      <div class="relative h-32 bg-brown-100">
        <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover" loading="lazy">
        ${badgeClass ? `<div class="absolute top-2 left-2 px-2 py-0.5 ${badgeClass} text-white text-xs font-bold rounded-full">${course.badge}</div>` : ''}
      </div>
      <div class="p-3">
        <h3 class="text-sm font-medium text-brown-900 line-clamp-2 mb-2">${course.title}</h3>
        <div class="flex items-center gap-2">
          ${course.priceOriginal ? `<span class="text-xs text-brown-400 line-through">${course.priceOriginal}</span>` : ''}
          <span class="text-sm font-bold ${course.priceSale?.includes('0') && !course.priceSale.match(/[1-9]/) ? 'text-green-600' : 'text-red-600'}">${course.priceSale}</span>
        </div>
      </div>
    </a>
  `;
}

// ==========================================
// Utilities
// ==========================================
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/#{1,6}\s*/g, '')           // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // Bold
    .replace(/\*([^*]+)\*/g, '$1')       // Italic
    .replace(/__([^_]+)__/g, '$1')       // Bold
    .replace(/_([^_]+)_/g, '$1')         // Italic
    .replace(/`([^`]+)`/g, '$1')         // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
    .replace(/^\s*[-*+]\s+/gm, '')       // List items
    .replace(/^\s*\d+\.\s+/gm, '')       // Numbered lists
    .replace(/^\s*>/gm, '')              // Blockquotes
    .replace(/\n{2,}/g, ' ')             // Multiple newlines to space
    .replace(/\n/g, ' ')                 // Newlines to space
    .trim();
}
