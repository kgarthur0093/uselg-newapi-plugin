# uselgv0.1

## 0.1.2

- 目标渠道恢复为标准 OpenAI 兼容上游（`channelTypes: [1]`、`upstreams: ["vendor"]`）。
- 因与 OpenAI 渠道类型 1 冲突，安装前必须先停用 NewAPI 内置 Sora 任务插件。
- 上游模型同步使用 NewAPI 常规的 `GET /v1/models`；任务适配能力仍限于插件声明的模型清单。

## 0.1.1

- 移除与 rc.44 内置 Sora 冲突的普通 OpenAI 渠道类型 `1` 声明。
- 增加 New API 上游能力，通过 `task_extend_plugin_keys` 绑定到 New API 渠道。
- 更新配置说明，Sora 与 uselgv0.1 可同时启用。

## 0.1.0

- 新增媒体任务适配器，渠道密钥与 Base URL 由 NewAPI 渠道配置提供。
- 保留图片、视频、音乐协议与按张、按次、按秒计费用量。
- 初版声明普通 OpenAI 渠道类型 `1`，与 rc.44 内置 Sora 冲突；0.1.1 已改为 New API 扩展绑定。
- `/v1/models` 同步仍由普通 OpenAI 渠道完成；任务插件的受支持模型清单仍为静态声明。
