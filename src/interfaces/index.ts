import type { MessageItem } from 'midjourney-fetch';
import {
  LayoutConfig,
  SupportedImageModels,
  SupportedImgSize,
  SupportedModel,
} from '@configs';

export type MidjourneyMessage = Pick<
  MessageItem,
  'id' | 'components' | 'attachments'
> & {
  prompt: string;
};

export interface Message {
  content: string;
  role: 'assistant' | 'user';
  imageModel?: SupportedImageModels; // distinguish avator
  midjourneyMessage?: MidjourneyMessage;
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
  password: string;
  openAIApiKey: string;
  model: SupportedModel; // text model
  imageModel: SupportedImageModels; // image model
  save: boolean;
  continuous: boolean;
  messagesCount: number;
  temperature: number;
  imagesCount: number;
  imageSize: SupportedImgSize;
  lang: Lang;
  discordServerId: string;
  discordChannelId: string;
  discordToken: string;
  layout: LayoutConfig;
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
