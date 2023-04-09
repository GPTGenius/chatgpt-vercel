import { FC } from 'react';

const SystemAvatar: FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img width={32} height={32} {...props} src="/openai.webp" />
);

export default SystemAvatar;
