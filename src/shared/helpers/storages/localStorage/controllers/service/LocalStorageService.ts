import { isServer } from "../../../../ssr";

export class LocalStorageService {
  private isInit: boolean;

  constructor() {
    this.isInit = false;
  }

  private initService() {
    if (!this.isInit) {
      this.isInit = true;
    }
  }

  setItem(key: string, value: string) {
    if (isServer) return;

    this.initService();
    localStorage.setItem(key, value);
  }

  getItem(key: string) {
    if (isServer) return null;

    this.initService();
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    if (isServer) return;

    this.initService();
    localStorage.removeItem(key);
  }
}