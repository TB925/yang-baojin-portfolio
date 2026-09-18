# 杨宝金 · 活动策划与项目管理

个人作品集，展示汽车营销、地产营销及品牌活动项目。包含 22 项完整方案、现场精选照片及活动视频。

## 本地运行

使用 Node.js 24 和 pnpm 11.19.0：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## 发布

推送到 `main` 后，GitHub Actions 自动构建并部署到 GitHub Pages。

```sh
pnpm build --base=/yang-baojin-portfolio/
```

在仓库的 **Settings → Pages → Source** 中选择 **GitHub Actions**。

网站使用的 PDF、精选照片与网页视频副本位于 `public/`。原始演示文件、本地备份与未使用素材未收录。

第三方组件的许可见 `public/licenses/`；PDF.js 许可见 `public/pdfjs/LICENSE`。活动方案、品牌素材和现场影像仅作个人作品展示，各自权利归相关权利人所有。
