import dayjs from 'dayjs';

export const getRelativeTime = (time: number, exact = false) => {
  if (!time) return '';
  const dayjsTime = dayjs(time);
  if (dayjsTime.isSame(dayjs(), 'date')) {
    return dayjsTime.format('HH:mm');
  }
  return dayjsTime.format(exact ? 'MM-DD HH:mm' : 'MM-DD');
};
