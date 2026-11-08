# 楼宇档案 · iOS 版（PWA，v4.2 楼层导视牌界面）

本目录是完整静态站点：整体上传到任意 HTTPS 静态托管（GitHub Pages / Cloudflare Pages / 对象存储等）的**根目录**，保留全部子目录结构，访问 `index.html` 即可。

- 界面：安卓 v4.2「楼层导视牌」视觉移植版（网页源 `src/index-v42.html`）
- 功能/数据：与安卓 v4.0–v4.2 行为一致，JSON 备份双向互通（`_meta.version=2`）
- 首次联网打开会后台预热 OCR 离线包（约 32MB，之后可断网使用）

部署步骤、iOS 安装方法与常见问题见《iOS-免费方案-部署指南.md》。
