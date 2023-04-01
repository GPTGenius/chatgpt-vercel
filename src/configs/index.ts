import { GlobalConfig } from '@interfaces';

export const globalConfigLocalKey = 'GLOBAL_CONFIG_LOCAL';
export const localConversationKey = 'LOCAL_CONVERSATION';

// From https://platform.openai.com/docs/models/model-endpoint-compatibility
export const supportedModels = [
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
] as const;

export type SupportedModel = (typeof supportedModels)[number];

export const defaultModel: SupportedModel = 'gpt-3.5-turbo';

// From https://platform.openai.com/docs/api-reference/images/create
export const supportedImgSizes = ['256x256', '512x512', '1024x1024'] as const;

export type SupportedImgSize = (typeof supportedImgSizes)[number];

export const defaultGloablConfig: GlobalConfig = {
  openAIApiKey: '',
  model: defaultModel,
  save: false,
  continuous: true,
  temperature: 1,
  imagesCount: 1,
  imageSize: '256x256',
  lang: 'en',
};
