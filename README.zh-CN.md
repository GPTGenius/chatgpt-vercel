![](./assets/preview_zh.png)

<h2 align="center">ChatGPT-Vercel</h2>

<p align="center">
  <a href="https://github.com/GPTGenius/chatgpt-vercel/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/github/license/GPTGenius/chatgpt-vercel">
  </a>
</p>

[English](./README.md) | 简体中文

## 简介
通过 Vercel 创建你自己的 ChatGPT 站点， 支持文本对话和预设提示。由 OpenAI API GPT-4/3.5 和 Vercel 提供支持。


## 功能
- [x] 文本对话
- [x] 预设提示
- [ ] 图像生成
- [ ] 音频

## 开始使用

### 1. 创建项目
从 github fork 的仓库（推荐）或者直接从下面的 **Deploy** 按钮创建一个 Vercel 项目。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/GPTGenius/chatgpt-vercel&env=OPENAI_API_KEY&env=LANGUAGE)

### 2. 设置 OPENAI_API_KEY
有三种方式设置你的 openai api key:
- 在 Vercel 上设置环境变量 **OPENAI_API_KEY**
- 把 `.env.expample` 文件重命名为 `.env` 然后设置 **OPENAI_API_KEY**
- 直接在页面中填写 **OPENAI_API_KEY** 

### 3. 设置语言
默认部署的站点和预设提示是英文的，如果你希望部署一个中文站点，可以设置 **LANGUAGE** 为 `zh`，支持在 Vercel 环境变量和 `.env` 文件中配置

## 在线示例
- [chatgpt-vercel-zh-sample](https://chatgpt-vercel-zh-sample.vercel.app/)

## 配置
### 部署配置
所有部署配置都可以在 `.env` 文件或者 Vercel 的环境变量中配置

| 配置项          | 默认值        | 描述                                                                                  | 
| -------------- | ------------- | ------------------------------------------------------------------------------------ |
| OPENAI_API_KEY | -             | Api 请求使用的 key, [如何生成](https://platform.openai.com/account/api-keys) |
| LANGUAGE       | en            | 站点语言，包含预设提示，支持的语言： **zh**/**en**              |


### 全局配置
所有页面中的全局配置都会被缓存到本地

| 配置项           | 默认值        | 描述                                                                                                      |
| --------------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| OpenAI Api Key  | -             | 和部署配置中的含义一样                                                                                      |
| 模型            | gpt-3.5-turbo | Api 请求中使用的模型，[支持的所有模型](https://platform.openai.com/docs/models/model-endpoint-compatibility) |
| 保留当前会话     | false         | 页面刷新当前会话不会丢失                                                                                    |

## 致谢
- 英文预设提示修改自：[awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- 中文预设提示修改自： [awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)

## 协议
基于 [MIT 协议]('./LICENSE')
