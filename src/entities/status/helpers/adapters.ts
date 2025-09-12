import type { DynamicStatusDataResources, StaticLevelDataResources } from '../api';
import type { MappedStaticLevel, MappedDynStatus } from '../types';

export function adaptStaticLevels(levels: StaticLevelDataResources[] | null): MappedStaticLevel[] {
  if (!levels) {
    return [];
  }

  const sortedLevels = levels.slice(0, -1).sort((levelA, levelB) => {
    return levelA.order - levelB.order;
  });

  let sum = 0;
  return sortedLevels.map((level) => {
    const newSum = sum + level.xpRequiredToLevelUp;
    const mappedLevel: MappedStaticLevel = {
      data: level,
      xpFrom: sum,
      xpTo: newSum,
    };
    sum = newSum;

    return mappedLevel;
  });
}

export function adaptDynamicStatuses(statuses: DynamicStatusDataResources[] | null): MappedDynStatus[] {
  if (!statuses) {
    return [];
  }

  const sortedStatuses = [...statuses].sort((statusA, statusB) => {
    return statusA.order - statusB.order;
  });

  let sum = 0;
  return sortedStatuses.map((status) => {
    const newSum = sum + status.spRequiredToLevelUp;
    const mappedStatus: MappedDynStatus = {
      data: status,
      spFrom: sum,
      spTo: newSum,
      confirmTo: sum + status.spRequiredToConfirm,
    };
    sum = newSum;

    return mappedStatus;
  });
}
