import { MemStorage, DatabaseStorage } from './storage';
import { AppConfig, InsertAppConfig, appConfig } from '../shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

// Implementación para la clase MemStorage
export function implementAppConfigOperationsForMemStorage(storage: any) {
  // App config operations
  storage.getAppConfigByKey = async function(key: string): Promise<AppConfig | undefined> {
    return Array.from(this.appConfigMap.values()).find(
      (config: AppConfig) => config.key === key
    );
  };

  storage.getAllAppConfig = async function(): Promise<AppConfig[]> {
    return Array.from(this.appConfigMap.values());
  };

  storage.createAppConfig = async function(config: InsertAppConfig): Promise<AppConfig> {
    const id = this.appConfigId++;
    const now = new Date();
    const newConfig: AppConfig = {
      ...config,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.appConfigMap.set(id, newConfig);
    return newConfig;
  };

  storage.updateAppConfig = async function(key: string, value: string): Promise<AppConfig | undefined> {
    const config = Array.from(this.appConfigMap.values()).find(
      (config: AppConfig) => config.key === key
    );
    
    if (!config) return undefined;
    
    const now = new Date();
    const updatedConfig: AppConfig = {
      ...config,
      value,
      updatedAt: now
    };
    
    this.appConfigMap.set(config.id, updatedConfig);
    return updatedConfig;
  };

  storage.deleteAppConfig = async function(id: number): Promise<boolean> {
    const exists = this.appConfigMap.has(id);
    if (!exists) return false;
    
    this.appConfigMap.delete(id);
    return true;
  };
}

// Implementación para la clase DatabaseStorage
export function implementAppConfigOperationsForDatabaseStorage(storage: any) {
  // App config operations
  storage.getAppConfigByKey = async function(key: string): Promise<AppConfig | undefined> {
    try {
      const [config] = await db.select()
        .from(appConfig)
        .where(eq(appConfig.key, key));
      return config;
    } catch (error) {
      console.error('Error getting app config by key:', error);
      return undefined;
    }
  };

  storage.getAllAppConfig = async function(): Promise<AppConfig[]> {
    try {
      return await db.select().from(appConfig);
    } catch (error) {
      console.error('Error getting all app config:', error);
      return [];
    }
  };

  storage.createAppConfig = async function(config: InsertAppConfig): Promise<AppConfig> {
    try {
      const now = new Date();
      const [newConfig] = await db.insert(appConfig)
        .values({
          ...config,
          createdAt: now,
          updatedAt: now
        })
        .returning();
      return newConfig;
    } catch (error) {
      console.error('Error creating app config:', error);
      throw error;
    }
  };

  storage.updateAppConfig = async function(key: string, value: string): Promise<AppConfig | undefined> {
    try {
      const now = new Date();
      const [updatedConfig] = await db.update(appConfig)
        .set({
          value,
          updatedAt: now
        })
        .where(eq(appConfig.key, key))
        .returning();
      return updatedConfig;
    } catch (error) {
      console.error('Error updating app config:', error);
      return undefined;
    }
  };

  storage.deleteAppConfig = async function(id: number): Promise<boolean> {
    try {
      const result = await db.delete(appConfig)
        .where(eq(appConfig.id, id))
        .returning({ id: appConfig.id });
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting app config:', error);
      return false;
    }
  };
}