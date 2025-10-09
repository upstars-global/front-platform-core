import type { MappedDynStatus, MappedStaticLevel } from '../../../entities/status/types';

export enum ProgressionType {
  DYNAMIC = 'DYNAMIC',
  STATIC = 'STATIC',
}

export type LevelOrStatus =
  | {
      type: ProgressionType.STATIC;
      data: MappedStaticLevel;
    }
  | {
      type: ProgressionType.DYNAMIC;
      data: MappedDynStatus;
    };

export type PointsData = {
  current: number;
  to: number;
  from: number;
  fromConfirm: number;
  confirm: number | null;
  type: ProgressionType;
};
