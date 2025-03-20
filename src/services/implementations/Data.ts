import { PrismaClient } from "@prisma/client";
import type { TimeFrame } from "../../models/TimeFrame";
import type { TimeAtWhichTheDataWasCaptured } from "../../models/TimeInPlace";
import type { OptionalPromise } from "../../utils/types/customPromises/OptionaPromise";
import type { VPromise } from "../../utils/types/customPromises/VPromise";
import type { IDataService, MemoizationStorage } from "../interfaces/Data";
import type { DataFromCertainPointInTime } from "../interfaces/GuardedService";
import { Optional } from "../../utils/Optional";

export class DataService implements IDataService {
  private readonly prisma: PrismaClient;
  readonly memoizationStorage: MemoizationStorage;

  constructor(memoizationStorage: MemoizationStorage) {
    this.prisma = new PrismaClient();
    this.memoizationStorage = memoizationStorage;
  }

  async get(timeFrame: TimeFrame): OptionalPromise<DataFromCertainPointInTime> {
    const cachedData = await this.memoizationStorage.get(timeFrame);

    if (cachedData.isNone()) {
      const dbData = await this.fetchDataFromDb(timeFrame);
      if (dbData.length > 0) {
        await this.memoizationStorage.addDataFromPerformedQuery({
          timeFrame,
          data: this.transformDbDataToPointInTime(dbData),
        });
      }
      return new Optional(this.transformDbDataToPointInTime(dbData));
    }

    return cachedData;
  }

  async memoize(timeFrame: TimeFrame): VPromise {
    const dbData = await this.fetchDataFromDb(timeFrame);
    await this.memoizationStorage.addDataFromPerformedQuery({
      timeFrame,
      data: this.transformDbDataToPointInTime(dbData),
    });
  }

  async addData(
    time: TimeAtWhichTheDataWasCaptured,
    data: DataFromCertainPointInTime
  ): VPromise {
    // Store data in DB
    const dbData = this.transformPointInTimeToDbData(data);
    await this.prisma.data.create({
      data: {
        timestamp: time,
        data: dbData,
      },
    });

    // Add to cache
    const timeFrame = { start: time, end: time };
    await this.memoizationStorage.addDataToExistingEntry(timeFrame, data);
  }

  private async fetchDataFromDb(timeFrame: TimeFrame) {
    return this.prisma.data.findMany({
      where: {
        timestamp: {
          gte: timeFrame.start,
          lte: timeFrame.end,
        },
      },
    });
  }

  private transformDbDataToPointInTime(dbData: any[]): DataFromCertainPointInTime {
    // Transform the DB data to match DataFromCertainPointInTime structure
    // This implementation depends on your specific data structure
    return dbData.map((item) => ({
      position: item.data.position,
      acceleration: item.data.acceleration,
      nadmorskaVisochina: item.data.nadmorskaVisochina,
      compas: item.data.compas,
      // ... map other required fields
    }))[0]; // Assuming we need the first record
  }

  private transformPointInTimeToDbData(data: DataFromCertainPointInTime): any {
    // Transform DataFromCertainPointInTime to DB structure
    return {
      position: data.position,
      acceleration: data.acceleration,
      nadmorskaVisochina: data.nadmorskaVisochina,
      compas: data.compas,
      // ... transform other fields
    };
  }
}

export class InMemoryMemoizationStorage implements MemoizationStorage {
  private storage: Map<string, { timeFrame: TimeFrame; data: DataFromCertainPointInTime }[]> = new Map();

  async addDataFromPerformedQuery(performedQueryData: { timeFrame: TimeFrame; data: DataFromCertainPointInTime }): VPromise {
      const key = this.generateKey(performedQueryData.timeFrame);
      if (!this.storage.has(key)) {
          this.storage.set(key, []);
      }
      this.storage.get(key)!.push(performedQueryData);
  }

  async get(timeFrame: TimeFrame): OptionalPromise<DataFromCertainPointInTime> {
      const key = this.generateKey(timeFrame);
      const storedEntries = this.storage.get(key) || [];
      for (const entry of storedEntries) {
          if (entry.timeFrame.start <= timeFrame.start && entry.timeFrame.end >= timeFrame.end) {
              return entry.data;
          }
      }
      return null;
  }

  async addDataToExistingEntry(timeFrame: TimeFrame, data: DataFromCertainPointInTime): VPromise {
      const key = this.generateKey(timeFrame);
      if (!this.storage.has(key)) {
          throw new Error("No existing entry for this timeframe.");
      }

      const entries = this.storage.get(key)!;
      for (const entry of entries) {
          if (entry.timeFrame.start <= timeFrame.start && entry.timeFrame.end >= timeFrame.end) {
              entry.data = { ...entry.data, ...data }; // Merge data
              return;
          }
      }
      throw new Error("Cannot add data: timeframe does not fit into existing entries.");
  }

  private generateKey(timeFrame: TimeFrame): string {
      return `${timeFrame.start.toISOString()}_${timeFrame.end.toISOString()}`;
  }
}
