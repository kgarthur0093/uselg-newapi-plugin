# uselgv0.1

NewAPI Task Plugin API v1 适配器，适用于 New API 网关渠道，处理 Uselg 图片、视频和音乐任务以及相应的按张、按次、按秒用量。

## 渠道配置

在 NewAPI rc.44 中保留内置 Sora，不要停用它。新增或编辑 **New API** 类型渠道（渠道类型不是 OpenAI），填写上游 API Base URL、API Key 和模型列表，然后在渠道高级设置的 `task_extend_plugin_keys` 中加入 `uselgv0-1`。插件会读取该渠道的 Base URL 与密钥，并按模型协议生成图片、视频或音乐请求。

绑定示例：

```json
{"task_extend_plugin_keys":["uselgv0-1"]}
```

绑定插件需要管理员具有 `task_plugin.bind` 权限。New API 渠道仍可按普通网关方式同步 `/v1/models`；插件声明的媒体模型还必须出现在该渠道的模型列表中，或通过 NewAPI 的模型映射加入。

插件模型目前在 `meta.models` 中静态声明。渠道同步出的模型只有在插件模型清单中，或被映射到清单中的受支持模型后，才能进入此插件的媒体适配流程。上游新增任意模型不会自动扩大插件的受支持集合。

## 与内置 Sora 共存

本版本不声明普通 OpenAI 渠道类型 `1`，因此可以与 rc.44 内置 `sora` 同时启用。不要把插件绑定到 OpenAI 类型渠道；请使用上面的 New API 渠道扩展绑定。这样 Sora 继续处理自己的 OpenAI 渠道，uselgv0.1 处理绑定了它的 New API 渠道。

## 版本标识

- NewAPI 插件 key：`uselgv0-1`（key 只允许小写字母、数字、下划线和连字符）
- 插件显示名：`uselgv0.1`
- 插件版本：`0.1.1`
