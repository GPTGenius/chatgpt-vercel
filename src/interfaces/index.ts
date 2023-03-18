export interface Message {
  content: string;
  role: 'assistant' | 'user';
}

export interface GlobalConfig {
  openAIApiKey: string;
  model: string;
}
