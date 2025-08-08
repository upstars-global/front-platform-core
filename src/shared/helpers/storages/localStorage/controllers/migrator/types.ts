export type Migration = {
  version: number;
  migrate: () => void;
};
