export interface Message {
  content: string;
  role: 'assistant' | 'user';
  createdAt?: number;
  expiredAt?: number; // for image mode
}

export type ConversationMode = 'text' | 'image';

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
  model: string;
  save: boolean;
  continuous: boolean;
  imagesCount: number;
}

export type Lang = 'zh' | 'en';

export interface Prompt {
  act: string;
  prompt: string;
}
