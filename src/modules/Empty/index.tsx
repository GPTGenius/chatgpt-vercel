import { FC, useContext } from 'react';
import { Empty as AntdEmpty } from 'antd';
import GlobalContext from '@contexts/global';

const Empty: FC = () => {
  const { i18n } = useContext(GlobalContext);
  return (
    <div className="h-full flex items-center justify-center">
      <AntdEmpty
        description={
          <div className="text-[12px] text-[#abb2bf]">
            {i18n.empty_conversation}
          </div>
        }
      />
    </div>
  );
};

export default Empty;
