import { SupportedImgSize, SupportedModel } from '@configs';

export interface Message {
  content: string;
  role: 'assistant' | 'user';
  createdAt?: number;
  expiredAt?: number; // for image mode
}

export type ConversationMode = 'text' | 'image';

export type StrategyMode = 'polling' | 'random';

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
  messagesCount: number;
  temperature: number;
  imagesCount: number;
  imageSize: SupportedImgSize;
  lang: Lang;
}

export interface Prompt {
  act: string;
  prompt: string;
}

export interface RecordCardItem {
  key: string;
  title: string;
  mode: ConversationMode;
  message: string; // last message
  time?: number; // last message time
}

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
