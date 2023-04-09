import { FC } from 'react';

interface ConfigIconProps {
  name: string;
  size?: number;
}
const ConfigIcon: FC<ConfigIconProps & React.HTMLAttributes<HTMLElement>> = ({
  name,
  size = 18,
  ...rest
}) => (
  <i
    {...rest}
    className={`${name} text-[${size}px] p-1 cursor-pointer hover:bg-[#edeeee] rounded-lg`}
  />
);
export default ConfigIcon;
