import { serverGlobalConfigs } from '@configs/server';
import { StrategyMode } from '@interfaces';

export function loadBalancer<T>(arr: T[], strategy: StrategyMode = 'random') {
  if (!Array.isArray(arr) || arr.length === 0) return () => null;
  if (arr.length === 1) return () => arr[0];

  if (strategy === 'polling') {
    // eslint-disable-next-line no-plusplus
    return () => arr[serverGlobalConfigs.polling++ % arr.length];
  }

  return () => arr[Math.floor(Math.random() * arr.length)];
}
