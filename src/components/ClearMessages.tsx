import { FC, useContext } from 'react';
import GlobalContext from '@contexts/global';

const ClearMessages: FC<{ onClear: () => void }> = ({ onClear }) => {
  const { i18n } = useContext(GlobalContext);
  return (
    <div className="flex flex-row-reverse">
      <div className="flex cursor-pointer p-4 text-gray-500" onClick={onClear}>
        <i className="ri-delete-bin-line mr-1"></i>
        {i18n.action_clear}
      </div>
    </div>
  );
};

export default ClearMessages;
