import { FC } from 'react';

interface SystemAvatarProps {
  role?: 'DALL-E' | 'Midjourney' | 'Replicate';
}

const SystemAvatar: FC<
  SystemAvatarProps & React.ImgHTMLAttributes<HTMLImageElement>
> = ({ role, ...props }) => {
  let src = '/openai.webp';
  if (role === 'Midjourney') {
    src = '/midjourney.webp';
  } else if (role === 'Replicate') {
    src = '/replicate.svg';
  }
  return <img width={32} height={32} {...props} src={src} />;
};

export default SystemAvatar;
