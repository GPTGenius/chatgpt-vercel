import { SupportedImgSize, SupportedModel } from '@configs';

export interface Message {
  content: string;
  role: 'assistant' | 'user';
  createdAt?: number;
  expiredAt?: number; // for image mode
}

export type ConversationMode = 'text' | 'image';

export type Lang = 'zh' | 'en';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  mode?: ConversationMode;
  createdAt: number;
  updatedAt?: number;
}

export interface GlobalConfig {
  openAIApiKey: string;
  model: SupportedModel;
  save: boolean;
  continuous: boolean;
  temperature: number;
  imagesCount: number;
  imageSize: SupportedImgSize;
  lang: Lang;
}

export interface Prompt {
  act: string;
  prompt: string;
}
