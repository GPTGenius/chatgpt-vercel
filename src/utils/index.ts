import { RecordCardItem } from '@interfaces';

export const getMaxIndex = (tabs: RecordCardItem[]) => {
  let max = tabs.length;
  tabs.forEach((tab) => {
    const index = Number(tab.key);
    if (!Number.isNaN(index) && Number(tab.key) >= max) {
      max = index + 1;
    }
  });
  return max;
};
