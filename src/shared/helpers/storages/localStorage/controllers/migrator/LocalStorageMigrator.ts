import type { Migration } from './types';

class LocalStorageMigrator {
  private getMigrationVersion(): number {
    const version = localStorage.getItem('localStorage_version');

    if (version) {
      const parsedVersion = Number(version);
      if (!isNaN(parsedVersion)) {
        return parsedVersion;
      }
    }

    return 0;
  }
  private setMigrationVersion(version: number) {
    localStorage.setItem('localStorage_version', String(version));
  }

  migrate(migrations: Migration[]) {
    let currentVersion = this.getMigrationVersion();

    migrations.forEach((migration: Migration) => {
      if (migration.version > currentVersion) {
        migration.migrate();
        currentVersion = migration.version;
      }
    });

    this.setMigrationVersion(currentVersion);
  }
}
export const localStorageMigrator = new LocalStorageMigrator();
