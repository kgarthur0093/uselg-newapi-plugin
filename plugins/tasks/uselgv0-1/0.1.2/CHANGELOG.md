# uselgv0.1

## 0.1.2

- Targets the standard OpenAI-compatible vendor channel (`channelTypes: [1]`, `upstreams: ["vendor"]`).
- Requires disabling the built-in Sora task plugin first because both plugins claim OpenAI channel type 1.
- Uses NewAPI's normal upstream model sync (`GET /v1/models`); supported task models remain the plugin's declared model set.

## 0.1.1

- Removes the ordinary OpenAI channel type `1` claim that conflicted with rc.44's built-in Sora plugin.
- Adds New API upstream support through `task_extend_plugin_keys` binding.
- Documents running Sora and uselgv0.1 together.

## 0.1.0

- Adds a media adapter for ordinary OpenAI-compatible channels, using the channel's configured key and base URL.
- Retains image, video, music protocols and count/request/second usage meters.
- The initial release claimed ordinary OpenAI channel type `1`, which conflicted with rc.44's built-in Sora plugin; 0.1.1 uses New API extension binding instead.
- `/v1/models` synchronization remains the responsibility of the ordinary OpenAI channel; the task plugin's supported model list remains statically declared.
