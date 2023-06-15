/* eslint-disable no-console */
import type { APIRoute } from 'astro';
import { loadBalancer } from '@utils/server';
import { createOpenjourney } from 'replicate-fetch';
import { SupportedImageModels } from '@configs';
import {
  Midjourney,
  type MessageType,
  type MessageTypeProps,
} from 'midjourney-fetch';
import { discordImageCdn } from '@configs/server';
import {
  apiKeyStrategy,
  apiKeys,
  baseURL,
  config,
  password as pwd,
  dicordServerId,
  discordChannelId,
  discordToken,
  discordImageProxy,
} from '.';

export { config };

export const get: APIRoute = async ({ request }) => {
  const { url, headers } = request;
  const params = new URL(url).searchParams;

  const model = params.get('model') as SupportedImageModels;
  const serverId = params.get('serverId') || dicordServerId;
  const channelId = params.get('channelId') || discordChannelId;
  const token = headers.get('Authorization') || discordToken;
  const prompt = params.get('prompt');
  const type = (params.get('type') as MessageType) || 'imagine';
  const timestamp = params.get('timestamp');

  if (model === 'Midjourney') {
    if (!prompt) {
      return new Response(
        JSON.stringify({
          msg: 'No prompt provided',
        }),
        {
          status: 400,
        }
      );
    }

    if (!serverId || !channelId || !token) {
      return new Response(
        JSON.stringify({
          msg: 'No serverId or channelId or dicordToken provided',
        }),
        {
          status: 400,
        }
      );
    }

    const midjourney = new Midjourney({
      serverId,
      channelId,
      token,
    });
    midjourney.debugger = true;

    try {
      let options: MessageTypeProps = { type: 'imagine', timestamp };

      if (type === 'upscale' || type === 'variation') {
        const index = params.get('index');
        if (!index) {
          return new Response(
            JSON.stringify({
              msg: `No ${type} index provided`,
            }),
            {
              status: 400,
            }
          );
        }
        options = {
          ...options,
          index: Number(index),
          type,
        };
      }

      const message = await midjourney.getMessage(prompt, options);

      if (message) {
        return new Response(
          JSON.stringify(
            discordImageProxy
              ? {
                  ...message,
                  attachments: message.attachments.map((attachment) => ({
                    ...attachment,
                    url: attachment.url.replace(
                      discordImageCdn,
                      discordImageProxy
                    ),
                  })),
                }
              : message
          ),
          { status: 200 }
        );
      }

      return new Response(JSON.stringify({ msg: 'No content found' }), {
        status: 200,
      });
    } catch (e) {
      return new Response(JSON.stringify({ msg: e.message || e.stack || e }), {
        status: 500,
      });
    }
  }

  return new Response('{}', {
    status: 200,
  });
};

export const post: APIRoute = async ({ request }) => {
  const body = await request.json();
  const {
    prompt,
    model,
    size = '256x256',
    n = 1,
    password,
  }: {
    prompt: string;
    model: SupportedImageModels;
    size: string;
    n: number;
    password: string;
  } = body;

  if (pwd && password !== pwd) {
    return new Response(
      JSON.stringify({ msg: 'No password or wrong password' }),
      {
        status: 401,
      }
    );
  }

  if (!prompt) {
    return new Response(
      JSON.stringify({
        msg: 'No prompt provided',
      }),
      {
        status: 400,
      }
    );
  }

  try {
    // Replicate model
    if (model === 'Replicate') {
      const len = size?.split('x')?.[0] ?? 256;
      const data = await createOpenjourney({
        prompt,
        width: Number(len),
        height: Number(len),
      });
      return new Response(
        JSON.stringify({
          data: data ?? [],
        }),
        { status: 200 }
      );
    }

    // Midjourney model
    if (model === 'Midjourney') {
      const serverId = body.serverId || dicordServerId;
      const channelId = body.channelId || discordChannelId;
      const token = request.headers.get('Authorization') || discordToken;
      const type: MessageType = body.type || 'imagine';

      if (!serverId || !channelId || !token) {
        return new Response(
          JSON.stringify({
            msg: 'No serverId or channelId or token provided',
          }),
          {
            status: 400,
          }
        );
      }

      const midjourney = new Midjourney({
        serverId,
        channelId,
        token,
      });
      midjourney.debugger = true;

      if (type === 'upscale' || type === 'variation') {
        const { messageId, customId }: { messageId: string; customId: string } =
          body;

        if (!messageId || !customId) {
          return new Response(
            JSON.stringify({
              msg: 'No messageId or customId',
            }),
            {
              status: 400,
            }
          );
        }

        await midjourney.createUpscaleOrVariation(type, {
          messageId,
          customId,
        });
      } else {
        await midjourney.createImage(prompt);
      }

      return new Response('{}', { status: 200 });
    }

    if (!baseURL) {
      return new Response(JSON.stringify({ msg: 'No LOCAL_PROXY provided' }), {
        status: 400,
      });
    }

    let { key } = body;

    if (!key) {
      const next = loadBalancer(apiKeys, apiKeyStrategy);
      key = next();
    }

    if (!key) {
      return new Response(JSON.stringify({ msg: 'No API key provided' }), {
        status: 400,
      });
    }

    const image = await fetch(`https://${baseURL}/v1/images/generations`, {
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
    const data = await image.json();

    const { data: images = [], error } = data;

    // error from openapi
    if (error?.message) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        data: images?.map((img) => img.url) || [],
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
