import dayjs from 'dayjs';

export const getRelativeTime = (time: number) => {
  const dayjsTime = dayjs(time);
  if (dayjsTime.isSame(dayjs(), 'date')) {
    return dayjsTime.format('HH:mm');
  }
  return dayjsTime.format('MM-DD');
};
