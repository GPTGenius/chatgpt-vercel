import type { APIRoute } from 'astro';
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser';
import { createParser } from 'eventsource-parser';
import { defaultModel, supportedModels } from '@configs';
import { Message } from '@interfaces';
import { apiKey, baseURL } from '.';

export const post: APIRoute = async ({ request }) => {
  if (!baseURL) {
    return new Response(JSON.stringify({ msg: 'No LOCAL_PROXY provided' }), {
      status: 400,
    });
  }

  const body = await request.json();
  const { messages, temperature = 1 } = body;
  let { key, model } = body;

  key = key || apiKey;
  model = model || defaultModel;

  if (!key) {
    return new Response(JSON.stringify({ msg: 'No API key provided' }), {
      status: 400,
    });
  }

  if (!supportedModels.includes(model)) {
    return new Response(
      JSON.stringify({ msg: `Not supported model ${model}` }),
      {
        status: 400,
      }
    );
  }

  try {
    const res = await fetch(`https://${baseURL}/v1/chat/completions`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      method: 'POST',
      body: JSON.stringify({
        model,
        messages: messages.map((message: Message) => ({
          role: message.role,
          content: message.content,
        })),
        temperature,
        stream: true,
      }),
    });
    if (!res.ok) {
      return new Response(JSON.stringify(res.body), {
        status: res.status,
        statusText: res.statusText,
      });
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const streamParser = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === 'event') {
            const { data } = event;
            if (data === '[DONE]') {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content || '';
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              controller.error(e);
            }
          }
        };

        const parser = createParser(streamParser);
        // eslint-disable-next-line no-restricted-syntax
        for await (const chunk of res.body as any)
          parser.feed(decoder.decode(chunk));
      },
    });

    return new Response(stream);
  } catch (e) {
    console.log('Error', e);
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500,
    });
  }
};
