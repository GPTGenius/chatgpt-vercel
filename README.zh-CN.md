![](./assets/preview_zh.png)

<h2 align="center">ChatGPT-Vercel</h2>

<p align="center">
  <a href="https://github.com/GPTGenius/chatgpt-vercel/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/github/license/GPTGenius/chatgpt-vercel">
  </a>
</p>

[English](./README.md) | 简体中文

## 简介
通过 Vercel 创建你自己的 ChatGPT 站点， 支持多组文本对话/预设提示/图像生成。由 OpenAI API GPT-4/3.5 和 Vercel 提供支持。


## 主要功能
- [x] 文本对话
- [x] 图像生成对话
- [x] 预设提示
- [x] 多语言切换
- [ ] 音频对话

## 在线示例
- [chatgpt-vercel-zh-sample](https://chatgpt-vercel-zh-sample.vercel.app/)
- [chatgpt-vercel-sample](https://chatgpt-vercel-sample.vercel.app/)

## 使用指南
可以访问上面的在线示例或者自己私有化部署进行体验

### 对话
点击左上角可以添加对话，有两种类型：
- 文本对话：
  - 默认为连续对话，每次发送会携带全量上下文
  - 支持添加预设提示，输入`/`或者点击左下角按钮添加
  - 支持模型配置，点击右上角设置图标进行配置
- 图像生成对话：
  - 不支持连续对话，每次发送不会携带上下文
  - 直接输入你想要的图片效果，例如：`一只猫`
  - 图片链接的有效访问时间为 `2` 小时，如有需要请及时保存

### 历史记录
全局设置中开启`保留所有会话`时会保存到本地缓存，默认不保存

### 操作
- `Enter` 键发送
- `Shift`+`Enter` 键换行
- 输入 `/` 添加预设，支持搜索

### 所有的设置
见 [配置](#配置)

## 私有化部署

### 1. 创建项目
从 github fork 的仓库（推荐）或者直接从下面的 **Deploy** 按钮创建一个 Vercel 项目。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GPTGenius/chatgpt-vercel&env=OPENAI_API_KEY&env=LANGUAGE)

### 2. 设置 OPENAI_API_KEY
有三种方式设置你的 OpenAI API Key:
- 在 Vercel 上设置环境变量 **OPENAI_API_KEY**
- 把 `.env.expample` 文件重命名为 `.env` 然后设置 **OPENAI_API_KEY**
- 直接在页面中填写 **OPENAI_API_KEY** 

如果没有 OpenAI API Key 可查看 [也许是时候拥有自己的「ChatGPT」了](https://juejin.cn/post/7210274432332939322)

### 3. 设置语言
默认部署的站点和预设提示是英文的，如果你希望部署一个中文站点，可以设置 **LANGUAGE** 为 `zh`，支持在 Vercel 环境变量和 `.env` 文件中配置

> 注意：Vercel 所有环境变量设置后需要重新部署才能生效

## 配置
### 部署配置
所有部署配置都可以在 `.env` 文件或者 Vercel 的环境变量中配置

| 配置项          | 默认值        | 描述                                                                                  | 
| -------------- | ------------- | ------------------------------------------------------------------------------------  |
| OPENAI_API_KEY | -             | Api 请求使用的 key, [如何生成](https://platform.openai.com/account/api-keys)            |
| LANGUAGE       | en            | 站点的默认语言，包含预设提示，支持的语言： **zh**/**en**                                  |


### 全局配置
所有页面中的全局配置都会被缓存到本地

| 配置项           | 默认值        | 描述                                                                                                      |
| --------------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| OpenAI Api Key  | -             | 和部署配置中的含义一样                                                                                      |
| 保留所有会话     | false         | 页面刷新会话不会丢失                                                                                        |
| 发散程度         | 1             | 数值越大，回答越随机，范围是 0-2                                                                            |
| 模型            | gpt-3.5-turbo | Api 请求中使用的模型，[支持的所有模型](https://platform.openai.com/docs/models/model-endpoint-compatibility) |
| 连续对话         | true          | 是否携带全量上下文进行对话                                                                                  |
| 生成图片数       | 1             | 图像生成对话时，单次对话生成的图片数                                                                         |
| 生成图片尺寸     | 256x256       | 图像生成对话时，单个图片的尺寸大小                                                                           |

## 本地开发
需要：
- **NodeJS** `v16.12.0` 或更高版本
- **pnpm** `v7` 或更高版本

代理：
- 本地默认通过自定义代理请求 openapi，需要在 `.env` 中设置 `LOCAL_PROXY`，暂不包含默认代理，设置代理请自行承担风险
- 不需要代理可以通过设置 `DISABLE_LOCAL_PROXY=true` 来关闭本地代理，此时会直接请求 `api.openai.com`

本地启动：
- 运行：`pnpm dev`
- 需要暴露端口，例如在 cloud ide 中使用，运行：`pnpm start`

构建：
- 运行：`pnpm build`

## 贡献
非常欢迎任何贡献。以下是一些提示：
- 改善翻译或者新增语言，修改 `lang` 目录，新增语言还需要修改 `src/utils/i18n.ts`
- 改善或者新增预设提示，修改 `prompts` 目录
- 优化 API，修改 `src/pages/api` 目录
- 优化页面交互，修改 `src/components` 目录
- 新增功能支持，可以直接提 issue

## 致谢
- 英文预设提示修改自：[awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- 中文预设提示修改自： [awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)

## 协议
基于 [MIT 协议](./LICENSE)
