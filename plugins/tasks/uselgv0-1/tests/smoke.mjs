import assert from "node:assert/strict";
import * as plugin from "../0.1.0/plugin.js";

const base = { apiKey: "fixture-key", baseUrl: "https://api.ai-media.vip", publicTaskId: "public-1" };

const imageRequest = plugin.protocols.openai_image.decodeRequest({
  ...base,
  model: "gpt-image-2",
  operation: "create",
  body: { kind: "json", value: { model: "gpt-image-2", prompt: "blue square", n: 1 } },
});
assert.equal(imageRequest.kind, "submit");
const imageDescriptor = plugin.buildSubmitRequest({ ...base, model: "gpt-image-2", requestBody: imageRequest.requestBody });
assert.equal(imageDescriptor.url, "https://api.ai-media.vip/v1/images/generations");
assert.equal(imageDescriptor.headers.Authorization, "Bearer fixture-key");
const imageTask = plugin.parseSubmitResponse({ ...base, model: "gpt-image-2" }, { statusCode: 200, body: { data: [{ url: "https://cdn.example/image.png" }] } });
assert.equal(imageTask.immediate.status, "SUCCESS");
assert.equal(plugin.protocols.openai_image.render({}, { created_at: 1, data: { data: [{ url: "https://cdn.example/image.png" }] } }).data[0].url, "https://cdn.example/image.png");

const mjV7Request = plugin.protocols.openai_image.decodeRequest({
  ...base,
  model: "midjourney-v7-full",
  operation: "create",
  body: { kind: "json", value: { model: "midjourney-v7-full", prompt: "blue square", size: "1024x1024", n: 1, async: true } },
});
const mjV7Descriptor = plugin.buildSubmitRequest({ ...base, baseUrl: "https://api.uselg.top", model: mjV7Request.model, requestBody: mjV7Request.requestBody });
assert.equal(mjV7Descriptor.url, "https://api.uselg.top/v1/images/generations");
assert.equal(plugin.buildQueryRequest({ ...base, baseUrl: "https://api.uselg.top", model: mjV7Request.model, taskId: "task-1" }).url, "https://api.uselg.top/v1/images/tasks/task-1");
const imageTaskWithAssets = {
  status: "SUCCESS",
  data: { assets: [{ download_url: "/v1/images/tasks/task-1/assets/result.png?download=1" }] },
  properties: { upstream_model_name: "midjourney-v7-full" },
};
const imageArtifact = plugin.listArtifacts(imageTaskWithAssets)[0];
assert.equal(imageArtifact.type, "image");
const imageContentRequest = plugin.buildContentRequest({
  apiKey: "fixture-key",
  baseUrl: "https://api.uselg.top",
  model: "midjourney-v7-full",
  artifactKey: imageArtifact.key,
  upstreamTaskId: "task-1",
  data: imageTaskWithAssets.data,
  clientRequest: { method: "GET" },
});
assert.equal(imageContentRequest.url, "https://api.uselg.top/v1/images/tasks/task-1/assets/result.png?download=1");
assert.equal(imageContentRequest.headers.Authorization, "Bearer fixture-key");
const externalImageData = { assets: [{ download_url: "https://cdn.example/image.png" }] };
const externalImageArtifact = plugin.listArtifacts({
  status: "SUCCESS",
  data: externalImageData,
  properties: { upstream_model_name: "midjourney-v7-full" },
})[0];
const externalImageRequest = plugin.buildContentRequest({
  apiKey: "fixture-key",
  model: "midjourney-v7-full",
  artifactKey: externalImageArtifact.key,
  data: externalImageData,
  clientRequest: { method: "GET" },
});
assert.equal(externalImageRequest.credentialless, true);
assert.equal(externalImageRequest.headers, undefined);

const geminiRequest = plugin.protocols.openai_image.decodeRequest({
  ...base,
  model: "gemini-3-pro-image-preview",
  operation: "create",
  body: { kind: "json", value: { model: "gemini-3-pro-image-preview", prompt: "blue square" } },
});
const geminiDescriptor = plugin.buildSubmitRequest({ ...base, model: geminiRequest.model, requestBody: geminiRequest.requestBody });
assert.equal(geminiDescriptor.url, "https://api.ai-media.vip/v1beta/models/gemini-3-pro-image-preview:generateContent");
assert.equal(geminiDescriptor.body.generationConfig.responseModalities[1], "IMAGE");
assert.equal(geminiDescriptor.headers["x-goog-api-key"], "fixture-key");
assert.equal(geminiDescriptor.headers.Authorization, undefined);

const fileRefRequest = plugin.protocols.openai_image.decodeRequest({
  ...base,
  model: "gemini-3-pro-image-preview",
  operation: "create",
  body: { kind: "json", value: { model: "gemini-3-pro-image-preview", prompt: "edit", images: [{ image_url: { __fileRef: "request_file:image", encoding: "dataUrl" } }] } },
});
const fileRefDescriptor = plugin.buildSubmitRequest({ ...base, model: fileRefRequest.model, requestBody: fileRefRequest.requestBody });
assert.equal(fileRefDescriptor.body.contents[0].parts[1].inlineData.data.__fileRef, "request_file:image");

const videoRequest = plugin.protocols.openai_video.decodeRequest({
  ...base,
  model: "grok-imagine-video-1.5（按次）",
  body: { kind: "json", value: { model: "grok-imagine-video-1.5（按次）", prompt: "blue square moving", seconds: 5 } },
});
const videoDescriptor = plugin.buildSubmitRequest({ ...base, model: videoRequest.model, requestBody: videoRequest.requestBody });
assert.equal(videoDescriptor.url, "https://api.ai-media.vip/v1/videos");
assert.equal(plugin.parseTaskResult({}, { status: "completed", progress: 100 }).status, "SUCCESS");
assert.equal(plugin.parseTaskResult({}, { status: "completed", video_available: false, asset_state: "saving" }).status, "IN_PROGRESS");

const musicRequest = plugin.protocols.openai_responses.decodeRequest({
  ...base,
  baseUrl: "https://api.uselg.top",
  model: "Lyria-3pro音频音乐",
  body: { kind: "json", value: { model: "Lyria-3pro音频音乐", input: "warm piano" } },
});
const musicDescriptor = plugin.buildSubmitRequest({ ...base, baseUrl: "https://api.uselg.top", model: musicRequest.model, requestBody: musicRequest.requestBody });
assert.equal(musicDescriptor.url, "https://api.uselg.top/v1/chat/completions");
const musicTask = plugin.parseSubmitResponse({ ...base, baseUrl: "https://api.uselg.top", model: musicRequest.model }, { statusCode: 200, body: { id: "music-1", data: [{ url: "https://cdn.example/audio.mp3" }] } });
assert.equal(musicTask.immediate.status, "SUCCESS");
assert.deepEqual(plugin.extractUsage({ model: "Lyria-3pro音频音乐", requestBody: {} }), { clips: 1 });

assert.deepEqual(plugin.extractUsage({ model: "grok-imagine-video-1.5-fast", requestBody: { seconds: 10 } }), { clips: 1 });
assert.deepEqual(plugin.extractUsage({ model: "grok-imagine-video-1.5-lite", requestBody: { seconds: 10 } }), { clips: 1 });
assert.deepEqual(plugin.extractUsageOnComplete({ properties: { upstream_model_name: "grok-imagine-video-1.5-lite" } }, {}, { seconds: 10 }), { clips: 1 });
assert.deepEqual(plugin.extractUsageOnComplete({ properties: { upstream_model_name: "midjourney-v7-full" } }, {}, { data: [{ url: "https://cdn.example/mj.png" }] }), { clips: 1 });

const audioArtifacts = plugin.listArtifacts({
  status: "SUCCESS",
  data: { choices: [{ message: { content: "试听：https://cdn.example/audio.mp3" } }] },
  properties: { upstream_model_name: "Lyria-3pro音频音乐" },
});
assert.equal(audioArtifacts.length, 1);
assert.equal(audioArtifacts[0].type, "audio");
const contentRequest = plugin.buildContentRequest({
  model: "Lyria-3pro音频音乐",
  artifactKey: audioArtifacts[0].key,
  data: { choices: [{ message: { content: "试听：https://cdn.example/audio.mp3" } }] },
  clientRequest: { method: "GET" },
});
assert.equal(contentRequest.url, "https://cdn.example/audio.mp3");
assert.equal(contentRequest.credentialless, true);
const response = plugin.protocols.openai_responses.renderFinal(
  { model: "Lyria-3pro音频音乐", artifacts: { [audioArtifacts[0].key]: { url: "https://newapi.example/artifact/audio-1" } } },
  { status: "SUCCESS", data: { choices: [{ message: { content: "试听：https://cdn.example/audio.mp3" } }] }, properties: { upstream_model_name: "Lyria-3pro音频音乐" } },
);
assert.match(response.output[0].content[0].text, /https:\/\/newapi\.example\/artifact\/audio-1/);

const modelSet = new Set(plugin.meta.models);
for (const profile of plugin.meta.usageProfiles) {
  for (const model of profile.models) assert(modelSet.has(model), `profile model is undeclared: ${model}`);
}
assert(!modelSet.has("seedance-2.0"));
assert(!modelSet.has("doubao-seedance-2.5"));
assert(!modelSet.has("Midjourney V7（满血）"));
assert(modelSet.has("midjourney-v8.2-full"));
for (const model of ["grok-imagine-video-1.5（按次）", "grok-imagine-video-1.5-fast", "grok-imagine-video-1.5-lite"]) {
  assert(modelSet.has(model), `missing per-request Grok model: ${model}`);
  const profile = plugin.meta.usageProfiles.find((item) => item.models.includes(model));
  assert(profile && profile.schema.clips, `per-request Grok model must use clips: ${model}`);
  assert.equal(profile.schema.seconds, undefined, `per-request Grok model must not expose seconds: ${model}`);
}

const geminiInlineResult = {
  candidates: [{ content: { parts: [{ inlineData: { mimeType: "image/png", data: "ZmFrZQ==" } }] } }],
};
assert.deepEqual(
  plugin.extractUsageOnComplete({ properties: { upstream_model_name: "gemini-3-pro-image-preview" } }, {}, geminiInlineResult),
  { image_count: 1 },
);
const nestedGeminiInline = { result: { response: { candidates: geminiInlineResult.candidates } } };
assert.equal(plugin.listArtifacts({ status: "SUCCESS", data: nestedGeminiInline, properties: { upstream_model_name: "gemini-3-pro-image-preview" } }).length, 0);
assert.match(
  plugin.protocols.openai_responses.renderFinal(
    { model: "gemini-3-pro-image-preview" },
    { status: "SUCCESS", data: nestedGeminiInline },
  ).output[0].content[0].text,
  /^data:image\/png;base64,ZmFrZQ==$/,
);
const responsesImage = plugin.protocols.openai_responses.decodeRequest({
  ...base,
  model: "gemini-3-pro-image-preview",
  body: { kind: "json", value: { model: "gemini-3-pro-image-preview", input: [{ role: "user", content: [{ type: "input_text", text: "edit" }, { type: "input_image", image_url: "data:image/png;base64,ZmFrZQ==" }] }] } },
});
assert.equal(responsesImage.requestBody.prompt, "edit");
assert.equal(responsesImage.requestBody.images[0].image_url, "data:image/png;base64,ZmFrZQ==");
const responsesFileImage = plugin.protocols.openai_responses.decodeRequest({
  ...base,
  model: "gemini-3-pro-image-preview",
  body: { kind: "json", value: { model: "gemini-3-pro-image-preview", input: [{ role: "user", content: [{ type: "input_image", image_url: { __fileRef: "request_file:image", encoding: "dataUrl" } }] }] } },
});
assert.equal(responsesFileImage.requestBody.images[0].image_url.__fileRef, "request_file:image");
const asyncImageQuery = plugin.buildQueryRequest({ ...base, model: "midjourney-full", taskId: "task-2", data: { status_url: "https://api.uselg.top/v1/images/tasks/task-2" } });
assert.equal(asyncImageQuery.url, "https://api.uselg.top/v1/images/tasks/task-2");
assert.deepEqual(
  plugin.extractUsageOnComplete(
    { state: { image_count: 3 }, properties: { upstream_model_name: "gpt-image-2" } },
    {},
    { status: "success", result_url: "/v1/images/tasks/task-3" },
  ),
  { image_count: 3 },
);

const uploadedVideo = plugin.buildSubmitRequest({
  ...base,
  model: "wan3.0-video",
  requestBody: { model: "wan3.0-video", prompt: "animate this image", seconds: 5 },
  files: [{ field: "image", ref: "request_file:image", filename: "reference.png" }],
});
assert.equal(uploadedVideo.bodyType, "multipart");
assert(uploadedVideo.parts.some((part) => part.name === "image" && part.fileRef === "request_file:image"));
assert.equal(uploadedVideo.parts.filter((part) => part.name === "image").length, 1);

assert.equal(plugin.parseTaskResult({}, { status: "dispatching" }).status, "IN_PROGRESS");
assert.equal(plugin.parseTaskResult({}, { status: "uncertain" }).status, "IN_PROGRESS");
assert.equal(plugin.parseTaskResult({}, { status: "paused" }).status, "IN_PROGRESS");
assert.equal(plugin.parseTaskResult({}, { status: "pending_confirmation" }).status, "IN_PROGRESS");

const wanReceipt = plugin.parseSubmitResponse(
  { ...base, model: "wan3.0-video", requestBody: { model: "wan3.0-video", seconds: 8, reference_videos: [{ url: "https://cdn.example/ref.mp4", duration: 4 }] } },
  { statusCode: 202, body: { request_id: "wan-request-1", status: "queued" } },
);
assert.equal(wanReceipt.taskId, "wan-request-1");
assert.deepEqual(wanReceipt.state, { reference_video_seconds: 4 });
assert.deepEqual(plugin.extractUsage({ model: "wan3.0-video", requestBody: { seconds: 8, reference_videos: [{ url: "https://cdn.example/ref.mp4", duration: 4 }] } }), { seconds: 12 });
assert.deepEqual(plugin.extractUsageOnComplete({ state: { reference_video_seconds: 4 }, properties: { upstream_model_name: "wan3.0-video" } }, {}, { seconds: 8 }), { seconds: 12 });

const signedImageData = { assets: [{ signed_url: "https://api.ai-media.vip/signed/result.png?sig=fixture", mime_type: "image/png" }] };
const signedImage = plugin.buildContentRequest({
  model: "gpt-image-2",
  artifactKey: "image-1",
  data: signedImageData,
  clientRequest: { method: "GET" },
});
assert.equal(signedImage.url, signedImageData.assets[0].signed_url);
assert.equal(signedImage.credentialless, true);
assert.equal(signedImage.headers, undefined);

assert.equal(plugin.meta.key, "uselgv0-1");
assert.equal(plugin.meta.name, "uselgv0.1");
assert.equal(plugin.meta.version, "0.1.0");
assert.deepEqual(plugin.meta.upstreams, ["vendor"]);
assert.deepEqual(plugin.meta.channelTypes, [1]);
assert.throws(() => plugin.protocols.openai_video.decodeRequest({
  model: "brand-new-upstream-model",
  body: { kind: "json", value: { model: "brand-new-upstream-model", prompt: "future model" } },
}), /model is not supported by uselgv0-1/);
const channelVideo = plugin.protocols.openai_video.decodeRequest({
  apiKey: "gateway-key",
  baseUrl: "https://uselg.example/v1",
  model: "grok-imagine-video-1.5（按次）",
  body: { kind: "json", value: { model: "grok-imagine-video-1.5（按次）", prompt: "gateway smoke" } },
});
const channelDescriptor = plugin.buildSubmitRequest({
  apiKey: "gateway-key",
  baseUrl: "https://uselg.example/v1",
  model: channelVideo.model,
  requestBody: channelVideo.requestBody,
});
assert.equal(channelDescriptor.url, "https://uselg.example/v1/videos");
assert.equal(channelDescriptor.headers.Authorization, "Bearer gateway-key");
const channelMusic = plugin.protocols.openai_responses.decodeRequest({
  apiKey: "gateway-key",
  baseUrl: "https://uselg.example/v1",
  model: "Lyria-3pro音频音乐",
  body: { kind: "json", value: { model: "Lyria-3pro音频音乐", input: "gateway piano" } },
});
const channelMusicDescriptor = plugin.buildSubmitRequest({
  apiKey: "gateway-key",
  baseUrl: "https://uselg.example/v1",
  model: channelMusic.model,
  requestBody: channelMusic.requestBody,
});
assert.equal(channelMusicDescriptor.url, "https://uselg.example/v1/chat/completions");
const channelGemini = plugin.protocols.openai_image.decodeRequest({
  apiKey: "gateway-key",
  baseUrl: "https://uselg.example/v1",
  model: "gemini-3-pro-image-preview",
  body: { kind: "json", value: { model: "gemini-3-pro-image-preview", prompt: "gateway image" } },
});
const channelGeminiDescriptor = plugin.buildSubmitRequest({
  apiKey: "gateway-key",
  baseUrl: "https://uselg.example/v1",
  model: channelGemini.model,
  requestBody: channelGemini.requestBody,
});
assert.equal(channelGeminiDescriptor.headers.Authorization, undefined);
assert.equal(channelGeminiDescriptor.headers["x-goog-api-key"], "gateway-key");

console.log("uselgv0-1 smoke fixtures passed");
