import { FC, useContext } from 'react';
import GlobalContext from '@contexts/global';
import { Tooltip } from 'antd';

const ClearMessages: FC<{ onClear: () => void }> = ({ onClear }) => {
  const { i18n } = useContext(GlobalContext);
  return (
    <Tooltip title={i18n.action_clear}>
      <div
        className="flex items-center cursor-pointer p-1 text-gray-500"
        onClick={onClear}
      >
        <i className="ri-delete-bin-line" />
      </div>
    </Tooltip>
  );
};

export default ClearMessages;
