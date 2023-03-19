import { FC } from 'react';

const ClearMessages: FC<{ onClear: () => void }> = ({ onClear }) => (
  <div className="flex flex-row-reverse">
    <div className="flex cursor-pointer p-4 text-gray-500" onClick={onClear}>
      <i className="ri-delete-bin-line"></i>
      Clear Messages
    </div>
  </div>
);

export default ClearMessages;
