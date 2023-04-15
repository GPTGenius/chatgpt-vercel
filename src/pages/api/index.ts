import { StrategyMode } from '@interfaces';

// read apiKey from env/process.env
export const apiKeys =
  (import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY)?.split(',') ??
  [];

// read disableProxy from env
export const disableProxy = import.meta.env.DISABLE_LOCAL_PROXY === 'true';

// read localProxy from env
export const localProxy = import.meta.env.LOCAL_PROXY;

export const apiBaseUrl =
  import.meta.env.OPENAI_API_BASE_URL ||
  process.env.OPENAI_API_BASE_URL ||
  'api.openai.com';

// use proxy in local env
export const baseURL = (
  process.env.NODE_ENV === 'development' && !disableProxy
    ? localProxy
    : apiBaseUrl
)?.replace(/^https?:\/\//i, '');

export const apiKeyStrategy: StrategyMode =
  import.meta.env.API_KEY_STRATEGY || process.env.API_KEY_STRATEGY || 'random';

/**
 * https://vercel.com/docs/concepts/edge-network/regions#region-list
 * disable hkg1 HongKong
 */
export const config = {
  runtime: 'edge',
  regions: [
    'arn1',
    'bom1',
    'bru1',
    'cdg1',
    'cle1',
    'cpt1a',
    'dub1',
    'fra1',
    'gru1',
    'hnd1',
    'iad1',
    'icn1',
    'kix1',
    'lhr1',
    'pdx1',
    'sfo1',
    'sin1',
    'syd1',
  ],
};
