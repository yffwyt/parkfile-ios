# 楼宇档案 PWA 静态包 · 构建说明（BUILD-NOTES）

> 本文件随 `pwa/` 一起交付；不参与站点运行，上传静态托管时可选择不带。

- 构建时间：2026-11-09 00:36:26（耗时 25.8s）
- 构建根：`C:\abuild\parkfile-v33-pwa`（git 分离工作树）
- 源页面：`src/index-v42.html`（v4.2「楼层导视牌」界面移植；行为基线 = 网页版 v3.3.1）
- 源指纹：365333 B / 6475 行 / SHA256 `9E193D65D274FA2BF40C71537E5651D50E9E4424EABA9196478CE3C55ED90A58`
- 补丁：**25 处**，全部「精确字符串替换 + 断言命中次数=1」；任一断言失败即非 0 退出
- 构建后自检：**13/13** 通过
- 字体子集：MiSansVF.ttf 19.16 MB → MiSansVF-subset.woff2 2.50 MB（7729 字符，未回退）
- 缓存版本：SW `CACHE=parkfile-pwa-v1`；更新 fonts/ort/models 时需升版本
- 数据格式：与安卓 App v4.2.0 双向兼容（JSON `_meta.version=2`）

其余验证需在构建后另跑（证据在 `.verify/`，不随站点发布）：

```powershell
python tools\serve.py 8771
$env:PWA_BASE='http://127.0.0.1:8771/pwa/'
node pwa\.verify\verify.cjs      # 81 项浏览器自动化
python pwa\.verify\compare.py    # 源/PWA 像素对比
```
