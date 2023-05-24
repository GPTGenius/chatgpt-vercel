import type { Message, MidjourneyMessage } from '@interfaces';
import type { MessageComponent, MessageType } from 'midjourney-fetch';

export const hasUpscaleOrVariation = (message: MidjourneyMessage) => {
  const { components } = message;

  if (components.length === 0) return false;

  const options = components.map((component) => component.components).flat(1);

  return options.some(
    (option) =>
      option.custom_id?.startsWith('MJ::JOB::upsample') ||
      option.custom_id?.startsWith('MJ::JOB::variation')
  );
};

export const filterUpscale = (options: MessageComponent[]) =>
  options.filter((option) => option.custom_id?.startsWith('MJ::JOB::upsample'));

export const filterVariation = (options: MessageComponent[]) =>
  options.filter(
    (option) =>
      option.custom_id?.startsWith('MJ::JOB::reroll') ||
      option.custom_id?.startsWith('MJ::JOB::variation')
  );

export const isComponentAvailable = (option: MessageComponent) =>
  option.style === 2;

export const updateComponentStatus = ({
  type,
  messageId,
  index,
  messages,
}: {
  type: MessageType;
  messageId: string;
  index: number;
  messages: Message[];
}) => {
  messages.some((msg) => {
    const match =
      msg.midjourneyMessage?.id && msg.midjourneyMessage.id === messageId;
    if (match) {
      let typeIndex: number;
      let prefix: string;
      if (type === 'upscale') {
        typeIndex = 0;
        prefix = 'MJ::JOB::upsample::';
      } else if (index > 0) {
        typeIndex = 1;
        prefix = 'MJ::JOB::variation::';
      } else {
        typeIndex = 0;
        prefix = 'MJ::JOB::reroll::';
      }
      msg.midjourneyMessage?.components?.[typeIndex]?.components?.some(
        (component) => {
          if (component.custom_id?.includes(`${prefix}${index}`)) {
            if (type === 'upscale') {
              // eslint-disable-next-line no-param-reassign
              component.style = 1;
            } else if (type === 'variation') {
              // eslint-disable-next-line no-param-reassign
              component.style = index > 0 ? 3 : 1;
            }
            return true;
          }
          return false;
        }
      );
    }
    return false;
  });

  return messages;
};
