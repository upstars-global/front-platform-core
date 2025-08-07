import { localStorageMigrator } from '../migrator';

class LocalStorageService {
  private isInit: boolean;

  constructor() {
    this.isInit = false;
  }

  private initService() {
    if (!this.isInit) {
      localStorageMigrator.migrate();
      this.isInit = true;
    }
  }

  setItem(key: string, value: string) {
    this.initService();
    localStorage.setItem(key, value);
  }

  getItem(key: string) {
    this.initService();
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    this.initService();
    localStorage.removeItem(key);
  }
}
export const localStorageService = new LocalStorageService();
