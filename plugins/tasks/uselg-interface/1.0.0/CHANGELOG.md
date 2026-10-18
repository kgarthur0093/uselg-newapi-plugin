---
changelogVersion: 1
plugin: "uselg-interface"
version: "1.0.0"
locale: "en"
translations:
  zh-CN: CHANGELOG.zh-CN.md
---
# Changelog

## [1.0.0]

### Added

- Add Uselg image support for OpenAI Images, Gemini `generateContent`, and asynchronous Midjourney image tasks.
- Add Uselg video support through `POST /v1/videos`, task polling, and protected content downloads.
- Add Uselg music support through synchronous `POST /v1/chat/completions` for Lyria and Suno models.
- Report separate image-count, video-second, video-request, and music-request usage fields so New API can price each model correctly.

### Fixed

- Preserve provider authentication for protected image and video assets, including relative task asset URLs.
- Handle synchronous image payloads, asynchronous image task payloads, and video file-saving states without treating a queued result as a completed file.
- Accept the published `image` multipart field for video references, signed image assets, Gemini inline image usage, and `dispatching`/`uncertain`/`paused` task states.
- Do not claim the host-owned Task Plugin channel type; bind this third-party adapter through the Task Plugin channel selector.

### Migration

- Create a Task Plugin channel with Base URL `https://api.ai-media.vip` and a Bearer API key; the plugin uses `https://api.uselg.top` for music and Midjourney operations.
- Configure image models with the `image_count` field, per-second video models with `seconds`, per-request video models with `clips`, and music models with `clips`.
