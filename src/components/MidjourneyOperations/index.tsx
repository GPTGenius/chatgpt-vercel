import { FC } from 'react';
import { Tag } from 'antd';
import type { MessageType } from 'midjourney-fetch';
import { MidjourneyMessage } from '@interfaces';
import {
  filterUpscale,
  filterVariation,
  isComponentAvailable,
} from '@utils/midjourney';

const { CheckableTag } = Tag;

const MidjourneyOperations: FC<{
  message: MidjourneyMessage;
  onClick?: (type: MessageType, id: string) => void;
}> = ({ message, onClick }) => {
  const upscale = filterUpscale(message.components[0]?.components ?? []);
  const variation = filterVariation([
    ...(message.components[0]?.components ?? []),
    ...(message.components[1]?.components ?? []),
  ]);
  return (
    <div>
      {upscale.map((option) => {
        const isAvailable = isComponentAvailable(option);
        return (
          <CheckableTag
            className="mt-3"
            key={option.custom_id || option.label}
            checked={!isAvailable}
            style={isAvailable ? { background: 'rgba(0, 0, 0, 0.06)' } : {}}
            onClick={() =>
              isAvailable && onClick?.('upscale', option.custom_id)
            }
          >
            {option.label || option.emoji?.name}
          </CheckableTag>
        );
      })}
      {variation.map((option) => {
        const isAvailable = isComponentAvailable(option);
        return (
          <CheckableTag
            className="mt-3"
            key={option.custom_id}
            checked={!isAvailable}
            style={isAvailable ? { background: 'rgba(0, 0, 0, 0.06)' } : {}}
            onClick={() =>
              isAvailable && onClick?.('variation', option.custom_id)
            }
          >
            {option.label || option.emoji?.name}
          </CheckableTag>
        );
      })}
    </div>
  );
};

export default MidjourneyOperations;
