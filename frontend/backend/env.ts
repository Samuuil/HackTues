import * as dotenv from "dotenv";
dotenv.config();

type EnvRecord<T extends string> = Record<T, string>;

type EnvEntry<T extends string> = {
  key: T;
  handler?: (envName: string) => string;
};

export class EnvManager<T extends string> {
  private envValues: EnvRecord<T> = {} as EnvRecord<T>;

  constructor(entries: EnvEntry<T>[]) {
    for (const entry of entries) {
      const envValue = process.env[entry.key];
      if (envValue !== undefined) {
        this.envValues[entry.key] = entry.handler
          ? entry.handler(envValue)
          : envValue;
      } else {
        throw new Error(`Environment variable ${entry.key} is not defined`);
      }
    }

    Object.keys(this.envValues).forEach((key) => {
      // @ts-ignore to allow dynamic key creation
      this[key] = this.envValues[key];
    });
  }

  get<K extends T>(key: K): string {
    const value = this.envValues[key];
    if (value !== undefined) {
      return value;
    }
    throw new Error(`Environment variable ${key} was not found and/or custom handler returned undefined`);
  }

  getAll(): EnvRecord<T> {
    return this.envValues;
  }
}


export const env =  new EnvManager([
    {
        key: "REDIS_URL",
    },

])
