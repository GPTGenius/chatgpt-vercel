![](assets/preview.png)

<h2 align="center">ChatGPT-Vercel</h2>

<p align="center">
  <a href="https://github.com/GPTGenius/chatgpt-vercel/tags">
    <img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/release/GPTGenius/chatgpt-vercel">
  </a>
  <img alt="node-current (scoped)" src="https://img.shields.io/node/v/replicate-fetch">
  <a href="https://github.com/GPTGenius/chatgpt-vercel/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/github/license/GPTGenius/chatgpt-vercel">
  </a>
</p>

English | [简体中文](./README.zh-CN.md)

## Introduction
Create a private ChatGPT website with one-click for free using Vercel, support muti **text** / **images generation** conversations. Powered by OpenAI API GPT-4/3.5 and Vercel.

## Features
- ⚡ Deploy quickly and for free using Vercel
- 💬 Text conversation with the ability to switch models and set context length
- 🎨 Image generation conversation supports the `DALL-E` and `Midjourney` models. It also allows for the adjustment of image size and count.
- 🌈 Multiple preset prompts added to customize AI behavior
- 🌏 Switch between various languages, currently supporting Simplified Chinese and English
- 💭 Local chat history saved with search, import and export functionality

## Live Demo
- [chatgpt-vercel-sample](https://chatgpt-vercel-sample.vercel.app/)
- [chatgpt-vercel-zh-sample](https://chatgpt-vercel-zh-sample.vercel.app/)

## User Guide
You can access the online demo above or deploy it privately for experience.

### Conversation
Click the icon at the top left to add a conversation, which has two types:
- Text conversation:
  - The model is switchable, [supported models](https://platform.openai.com/docs/models/model-endpoint-compatibility)
  - By default, it is a continuous conversation, and each sending will carry part of context.
  - Supports adding preset prompts, type `/` or click the button at the bottom left to add.
  - Supports model configuration, click the settings icon at the top right to configure.
- Image generation conversation:
  - The model is switchable, supports the OpenAI `DALL·E` model and `Midjourney` 
  - Does not support continuous conversation, and each sending will not carry the context.
  - Directly input the image effect you want, for example: `a cat`.
  - For model `DALL-E`, expend `OpenAI` tokens. The effective access time for the image link is `2` hours. Please make sure to save it in time if necessary.
  - For model `Midjourney`, depending on the `Discord` configurations, image generation may take a while, with a default timeout of `5` minutes. Please be patient and wait.

### History record
When `Save all conversations` is enabled in the global settings, it will be saved to local cache. By default, it will not be saved.

### Operation
- Press `Enter` to send
- Press `Shift`+`Enter` to line break
- Enter `/` to add preset prompts, and searching is also supported.

### All settings
see [Configurations](#Configurations)

## Getting Started

### 1. Create Project
Create Vercel project from a github forked project(recommand) or the following **Deploy** button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GPTGenius/chatgpt-vercel&env=OPENAI_API_KEY)

### 2. Set OPENAI_API_KEY
There are three ways to set your OpenAI API Key:
- Set Vercel Environment Variables **OPENAI_API_KEY**
- Rename your `.env.expample` file to `.env` and set **OPENAI_API_KEY**
- Set **OPENAI_API_KEY** within the page

> Attention: For Vercel, all environment variables need to be redeployed to take effect.

### 3. Set Midjourney (optional)
If you want to use the AI drawing feature of `Midjourney`, you can configure the relevant `Discord` settings , including the following fields:
- `DISCORD_SERVER_ID`
- `DISCORD_CHANNEL_ID`
- `DISCORD_TOKEN`

How to get ids and token:
- [How to find ids](https://docs.statbot.net/docs/faq/general/how-find-id/)
- [Get discord token](https://www.androidauthority.com/get-discord-token-3149920/)

You can visit [midjourney-cookbook](https://gptgenius.github.io/midjourney-cookbook/) to get some samples about `Midjourney` prompts.

### 4. Keep code synchronized (optional)
see [Sync Fork](docs/sync.md)

## Other deployment methods
Run `pnpm build` and `pnpm run server`. Refer: [astro-node](https://docs.astro.build/en/guides/integrations-guide/node/#standalone)

## Configurations
### Deployment Configurations
All deployment configurations could be configured in the `.env` file or in **Environment Variables** of Vercel

| Configuration       | Default Value  | Description                                                                                                                           | 
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| PASSWORD            | -              | Website access password                                                                                                               |
| OPENAI_API_KEY      | -              | Key for API request, multiple keys are supported, separated by commas, [how to generate](https://platform.openai.com/account/api-keys)|
| LANGUAGE            | en             | The default language of the website, including prompts. Supported languages: **zh**/**en**                                            |
| API_KEY_STRATEGY    | random         | The scheduling strategy mode for multiple keys: **polling**/**random**                                                                |
| OPENAI_API_BASE_URL | api.openai.com | The default address of the requested api                                                                                              |
| DISCORD_SERVER_ID   | -              | Discord server id                                                                                                                     |
| DISCORD_CHANNEL_ID  | -              | Discord channel id                                                                                                                    |
| DISCORD_TOKEN       | -              | Discord token                                                                                                                         |
| DISCORD_IMAGE_PROXY | -              | Discord image proxy url                                                                                                               |  


### Global Configurations
All global configurations will be stored locally

| Configuration                         | Default Value | Description                                                                                                           |
| ------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| OpenAI Api Key                        | -             | Only a single key is supported. If it is configured on the page, the key in the environment variable will not be used |
| Language                              | en            | The language of the website, including prompts. Supported languages: **zh**/**en**                                    |
| Save all conversations                | true          | The conversation won't be lost after the page is refreshed                                                            |
| Temperature                           | 1             | The larger the value, the more random the answer, with a range of 0-2                                                 |
| Text Conversation Model               | gpt-3.5-turbo | Model used in api request, [supported models](https://platform.openai.com/docs/models/model-endpoint-compatibility)   |
| Continuous conversations              | true          | Carry the context for the conversations                                                                               |
| Number of historical messages carried | 4             | For continuous conversations, the number of historical messages carried                                               |
| Image Generation Conversation Model   | DALL-E        | Supported models: **DALL-E** / **Midjourney** / **Replicate**                                                         |
| Number of generated images            | 1             | The number of images generated in a single image generation conversation                                              |
| Size of generated images              | 256x256       | The size of a single image in image generation conversation                                                           |
| Discord Server Id                     | -             | If it is configured on the page, the key in the environment variable will not be used                                 |
| Discord Channel Id                    | -             | Ditto                                                                                                                 |
| Discord Token                         | -             | Ditto                                                                                                                 |  

## Planned Features
- [ ] Export functionality to export as markdown and images
- [ ] Theme color switching support, currently defaulting to gradient purple
- [ ] Audio conversation support
- [x] Image generation using other models

These are some of the planned features to be developed. Collaborations are welcome, and feel free to suggest other ideas by submitting issues.

## Development
Requirements:
- **NodeJS** `v18` or higher
- **pnpm** `v7` or higher

Proxy
- By default, a custom proxy is used to request openapi locally, and `LOCAL_PROXY` needs to be set in `.env`. There is currently no default proxy, so if you choose to set up a proxy, you assume the associated risks.
- If there is no need for a proxy, you can disable local proxy by setting `DISABLE_LOCAL_PROXY=true` in the `.env` file. At this point, `api.openai.com` will be directly requested.

Development:
- Run `pnpm dev`
- Expose port, for example, when using in cloud ide, run `pnpm start`

Build:
- Run `pnpm build`

## Contribution
Any contributions are highly appreciated. Here are some tips:
- To improve the translation or add a new language, modify the `lang` directory. If adding a new language, you will also need to modify `src/utils/i18n.ts`.
- To improve or add new preset prompts, modify the `prompts` directory.
- To optimize the API, modify the `src/pages/api` directory.
- To optimize page interactions, modify the `src/modules` directory.
- For new feature support, please open an issue directly.

## Credits
- English prompts are modified from [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- Chinese prompts are modified from [awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=GPTGenius/chatgpt-vercel&type=Date)](https://star-history.com/#GPTGenius/chatgpt-vercel&Date)

## License
Based on [MIT License](./LICENSE)
