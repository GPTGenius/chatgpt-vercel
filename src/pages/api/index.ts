// read apiKey from env/process.env
export const apiKey =
  import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

// read disableProxy from env
export const disableProxy = import.meta.env.DISABLE_LOCAL_PROXY === 'true';

// read localProxy from env
export const localProxy = import.meta.env.LOCAL_PROXY;

// use proxy in local env
export const baseURL =
  process.env.NODE_ENV === 'development' && !disableProxy
    ? localProxy?.replace(/^https?:\/\//i, '')
    : 'api.openai.com';
