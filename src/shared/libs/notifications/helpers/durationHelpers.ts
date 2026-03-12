import type { NotificationOptions } from '../types';
import type { DurationConfig } from '../config';

export function getEffectiveDuration(
  options: NotificationOptions,
  config: DurationConfig,
): number | null {
  if (options.persistent) return null;
  if (options.duration !== undefined) return options.duration;

  const typeDuration = options.type ? config.durationByType[options.type] : undefined;
  
  return typeDuration !== undefined ? typeDuration : config.defaultDuration;}
