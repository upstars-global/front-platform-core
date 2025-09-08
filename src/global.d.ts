import { EnvironmentType } from './entities/environment/types';

declare global {
  declare const DEV: boolean;
  declare const ENVIRONMENT: EnvironmentType;
}
