import type { APIRoute } from "astro"

// read apiKey from env/process.env
const apiKey = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

// use proxy in local env
const baseURL = process.env.NODE_ENV === 'development' ? 'gptgenius-proxy.zeabur.app/proxy' : 'api.openai.com'


export const post: APIRoute = async ({ request }) => {
  const body = await request.json()
  const {
    messages = [{
      "role": "user",
      "content": "hello"
    }],
    key = apiKey,
  } = body;
  try {
    const completion = await fetch(`https://${baseURL}/v1/chat/completions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      })
    })
    const data = await completion.json();
  
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e  }), { status: 500 })
  }

}
