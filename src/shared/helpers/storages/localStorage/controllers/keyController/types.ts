export type LocalStorageData<T> = {
  value: T;
  expire?: number | null;
};

export type LocalStorageKeyControllerOptions<T> = {
  expires?: () => number;
  defaultValue: () => T;
};
