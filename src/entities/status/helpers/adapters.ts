import { RewardType } from '../api/types';
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
  let prevCashbackBonus: number | undefined = undefined;
  return sortedLevels.map((level) => {
    const newSum = sum + level.xpRequiredToLevelUp;

    // find cashback reward
    const cashbackReward = level.rewards?.find((r) => r.type === RewardType.Cashback);
    const weeklyCashback = cashbackReward ? {
      ...cashbackReward.value,
      isIcon: prevCashbackBonus ? prevCashbackBonus < cashbackReward.value.bonus : true,
    } : undefined;

    const mappedLevel: MappedStaticLevel = {
      data: level,
      xpFrom: sum,
      xpTo: newSum,
      ...(weeklyCashback ? { weeklyCashback } : {}),
    };

    // update prev bonus if current has cashback
    if (weeklyCashback) {
      prevCashbackBonus = weeklyCashback.bonus;
    }

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
  let prevCashbackBonus: number | undefined = undefined;
  return sortedStatuses.map((status) => {
    const newSum = sum + status.spRequiredToLevelUp;

    // find cashback reward
    const cashbackReward = status.rewards?.find((r) => r.type === RewardType.Cashback);
    const weeklyCashback = cashbackReward ? {
     ...cashbackReward.value,
      isIcon: prevCashbackBonus ? prevCashbackBonus < cashbackReward.value.bonus : true,
    } : undefined;

    const mappedStatus: MappedDynStatus = {
      data: status,
      spFrom: sum,
      spTo: newSum,
      confirmTo: sum + status.spRequiredToConfirm,
      weeklyCashback,
      ...(weeklyCashback ? { weeklyCashback } : {}),
    };

    // update prev bonus if current has cashback
    if (weeklyCashback) {
      prevCashbackBonus = weeklyCashback.bonus;
    }

    sum = newSum;

    return mappedStatus;
  });
}
