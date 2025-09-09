import { EnvironmentType } from '../types';

interface EnvironmentState {
  baseUrl: string;
  environment: EnvironmentType;
  version: string;
  isMockerMode: boolean;
}

const defaultEnvironmentState: EnvironmentState = {
  baseUrl: '/',
  environment: EnvironmentType.PRODUCTION,
  version: '',
  isMockerMode: false,
};

let environmentState: EnvironmentState = {
  ...defaultEnvironmentState,
};

export const configEnvironment = {
  getBaseUrl: (): EnvironmentState['baseUrl'] => {
    return environmentState.baseUrl;
  },
  setBaseUrl: (url: EnvironmentState['baseUrl']) => {
    environmentState = { ...environmentState, baseUrl: url };
  },
  getEnvironment: (): EnvironmentState['environment'] => {
    return environmentState.environment;
  },
  setEnvironment: (env: EnvironmentState['environment']) => {
    environmentState = { ...environmentState, environment: env };
  },
  getVersion: (): EnvironmentState['version'] => {
    return environmentState.version;
  },
  setVersion: (version: EnvironmentState['version']) => {
    environmentState = { ...environmentState, version };
  },
  getIsMockerMode: (): EnvironmentState['isMockerMode'] => {
    return environmentState.isMockerMode;
  },
  setIsMockerMode: (isMockerMode: EnvironmentState['isMockerMode']) => {
    environmentState = { ...environmentState, isMockerMode };
  },
  resetEnvironmentConfig: () => {
    environmentState = {
      ...defaultEnvironmentState,
    };
  },
};
