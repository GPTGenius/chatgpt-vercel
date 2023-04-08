import { FC } from 'react';
import avatarImage from 'assets/openai.webp';

const SystemAvatar: FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img width={32} height={32} {...props} src={avatarImage} />
);

export default SystemAvatar;
