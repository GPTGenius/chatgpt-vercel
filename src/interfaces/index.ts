export interface Message {
  content: string;
  role: 'assistant' | 'user';
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt?: number;
}

export interface GlobalConfig {
  openAIApiKey: string;
  model: string;
  save: boolean;
}

export type Lang = 'zh' | 'en';

export interface Prompt {
  act: string;
  prompt: string;
}
