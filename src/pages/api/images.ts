import type { APIRoute } from 'astro';

// read apiKey from env/process.env
const apiKey = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

// read disableProxy from env
const disableProxy = import.meta.env.DISABLE_LOCAL_PROXY === 'true';

// read localProxy from env
const localProxy = import.meta.env.LOCAL_PROXY;

// use proxy in local env
const baseURL =
  process.env.NODE_ENV === 'development' && !disableProxy
    ? localProxy
    : 'api.openai.com';

export const post: APIRoute = async ({ request }) => {
  if (!baseURL) {
    return new Response(JSON.stringify({ msg: 'No LOCAL_PROXY provided' }), {
      status: 400,
    });
  }

  const body = await request.json();
  const { prompt, size = '256x256', n = 1 } = body;
  let { key } = body;

  key = key || apiKey;

  if (!key) {
    return new Response(JSON.stringify({ msg: 'No API key provided' }), {
      status: 400,
    });
  }

  try {
    const completion = await fetch(`https://${baseURL}/v1/images/generations`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      method: 'POST',
      body: JSON.stringify({
        prompt,
        size,
        n,
      }),
    });
    const data = await completion.json();

    const { data: images = [], error } = data;

    // error from openapi
    if (error?.message) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        data: images?.map((image) => image.url) || [],
      }),
      { status: 200 }
    );
  } catch (e) {
    console.log('Error', e);
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500,
    });
  }
};
