# uselgv0.1

- Adds a media adapter for ordinary OpenAI-compatible channels, using the channel's configured key and base URL.
- Retains image, video, music protocols and count/request/second usage meters.
- New API rc.44's built-in Sora plugin also claims OpenAI channel type 1; disable Sora before installing this plugin to avoid a channel type conflict.
- `/v1/models` synchronization remains the responsibility of the ordinary OpenAI channel; the task plugin's supported model list remains statically declared.
