---
changelogVersion: 1
plugin: "uselg-interface"
version: "1.0.0"
locale: "zh-CN"
---
# Changelog

## [1.0.0]

### Added

- 新增 Uselg 图片适配，支持 OpenAI Images、Gemini `generateContent` 及异步 Midjourney 图片任务。
- 新增 Uselg 视频适配，支持 `POST /v1/videos`、任务查询和受保护成片下载。
- 新增 Uselg 音乐适配，Lyria 与 Suno 使用同步 `POST /v1/chat/completions`。
- 分别报告图片张数、视频秒数、视频请求次数和音乐请求次数，供 New API 按模型计费。

### Fixed

- 保护需要鉴权的图片和视频资源下载，并处理相对任务资源地址。
- 区分同步图片、异步图片任务和视频文件保存状态，避免把排队结果误判为完成。
- 支持官方文档中的视频 `image` multipart 参考图、签名图片资产、Gemini inline 图片用量，以及 `dispatching`/`uncertain`/`paused` 任务状态。
- 不再声明宿主所有的 Task Plugin 旧渠道类型，通过任务插件渠道选择器绑定此第三方适配器。

### Migration

- 创建 Task Plugin 渠道，Base URL 填 `https://api.ai-media.vip` 并配置 Bearer API Key；音乐和 Midjourney 操作由插件访问 `https://api.uselg.top`。
- 图片模型使用 `image_count`，按秒视频使用 `seconds`，按次视频使用 `clips`，音乐模型使用 `clips` 配置价格。
