import { FC, useContext } from 'react';
import { RecordCardItem } from '@interfaces';
import { getRelativeTime } from '@utils/date';
import './index.css';
import GlobalContext from '@contexts/global';

interface RecordCardProps {
  data: RecordCardItem;
  onSelect: () => void;
  onDelete?: () => void;
  selected?: boolean;
}

const RecordCard: FC<RecordCardProps> = ({
  data,
  onSelect,
  onDelete,
  selected,
}) => {
  const { i18n } = useContext(GlobalContext);
  const contentClass = `text-sm ${
    selected ? 'text-[rgba(255,255,255,0.8)]' : 'text-[#a1a7a8]'
  }`;
  return (
    <div
      className={`sidebar-record-item relative ${
        selected ? 'bg-gradient' : 'hover:bg-[#edeeee]'
      } cursor-pointer p-2 pt-[2px] pb-[2px] h-[60px] rounded-lg`}
      onClick={onSelect}
    >
      <div
        className={`${
          selected ? 'text-white' : 'text-[#47494e]'
        } flex items-baseline justify-between`}
        style={{ lineHeight: '2rem' }}
      >
        <div className="truncate flex-1">{data.title || i18n.status_empty}</div>
        <div
          className={`sidebar-record-item-time ${contentClass} w-[60px] text-right`}
        >
          {data.time ? getRelativeTime(data.time) : ''}
        </div>
      </div>
      <div
        className={`${contentClass} flex items-center justify-between`}
        style={{ lineHeight: '1.5rem' }}
      >
        <div className="truncate flex-1">{data.message}</div>
        <div
          className={`sidebar-record-item-mode ${contentClass} w-[60px] text-right`}
        >
          {data.mode === 'image' ? (
            <i className="ri-image-line align-bottom" />
          ) : (
            <i className="ri-chat-4-line align-bottom" />
          )}
        </div>
      </div>
      {onDelete ? (
        <div
          className={`sidebar-record-item-delete absolute p-2 right-0 top-3 ${contentClass} hidden `}
          onClick={(e) => {
            onDelete();
            e.stopPropagation();
          }}
        >
          <i className="ri-close-line" />
        </div>
      ) : null}
    </div>
  );
};

export default RecordCard;
