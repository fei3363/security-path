# Security Learning Path

A cybersecurity learning roadmap platform powered by GitHub Issues.

[繁體中文版 README](./README_TW.md)

![Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## Project Goal

A security learning path database derived from feifei.tw, providing a more systematic cybersecurity learning platform. To supplement security learning resources, we also curate high-quality existing resources into this learning path database.

## Features

- **GitHub-Powered** - Uses GitHub Issues as database, no backend required
- **Community Submissions** - Anyone can submit learning paths via GitHub Issue forms
- **Built-in Review System** - Approve submissions by adding labels in GitHub
- **Difficulty Levels** - Filter by Beginner, Intermediate, or Advanced
- **Learning Resources** - Each path includes related articles and resources
- **Prerequisites** - Clear indication of required knowledge
- **Estimated Time** - Know how long each path takes
- **Search & Filter** - Find paths by category, tags, or keywords
- **Responsive Design** - Works on desktop and mobile

## How It Works

1. **Submit** - Users click "Add Path" → Opens GitHub Issue form
2. **Review** - Maintainer reviews the Issue and adds `approved` label
3. **Display** - Website automatically shows Issues with `approved` label

## Project Structure

```
security-path/
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── path-submission.yml      # Chinese submission form
│       └── path-submission-en.yml   # English submission form
├── index.html                       # Main page
├── security-path.css                # Styles
├── security-path.js                 # Logic (GitHub API)
├── README.md                        # English docs
└── README_TW.md                     # Chinese docs
```

## Configuration

Edit the GitHub config in `security-path.js`:

```javascript
const GITHUB_CONFIG = {
  owner: 'your-username',    // Your GitHub username
  repo: 'security-path',     // Repository name
  label: 'approved'          // Label for approved paths
};
```

## Label System

| Label | Purpose |
|-------|---------|
| `pending` | New submissions (default) |
| `approved` | Approved and displayed on website |

## Categories

- **Network Security** - TCP/IP, firewalls, VPN, IDS/IPS
- **Penetration Testing** - Kali Linux, Metasploit, OSCP
- **Web Security** - OWASP Top 10, XSS, SQL Injection
- **Cryptography** - Encryption, PKI, TLS/SSL
- **Malware Analysis** - Reverse engineering, IDA Pro, Ghidra
- **Cloud Security** - AWS, Azure, GCP, Kubernetes

## Deployment

### GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Set source to **main branch**
3. Your site will be live at `https://path.feifei.tw`


## License

GNU General Public License v3.0

