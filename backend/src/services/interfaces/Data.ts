import type { TimeFrame } from "../../models/TimeFrame";
import type { TimeAtWhichTheDataWasCaptured } from "../../models/TimeInPlace";
import type { OptionalPromise } from "../../utils/types/customPromises/OptionaPromise";
import type { VPromise } from "../../utils/types/customPromises/VPromise";
import type { DataFromCertainPointInTime } from "./GuardedService";

export interface MemoizationStorage{
    addDataFromPerformedQuery(performedQueryData: {
        timeFrame: TimeFrame,
        data: DataFromCertainPointInTime
    }): VPromise
    get(timeFrame: TimeFrame): OptionalPromise<DataFromCertainPointInTime>
    addDataToExistingEntry(timeFrame: TimeFrame, data: DataFromCertainPointInTime): VPromise // here we need to check if the data can be added for exampel we cant add data from the period of 10:00:00 to 15:00:00 to 00:00:00 - 05:00:00 since we will have a hole 
}


export interface IDataService{
    memoizationStorage: MemoizationStorage
    get(timeFrame: TimeFrame): OptionalPromise<DataFromCertainPointInTime> // in this we should use the memoizer to try to get the data from there and if it is not there we should add it
    memoize(timeFrame: TimeFrame): VPromise // since reading data each time from postgre is a bit slow 
    addData(time: TimeAtWhichTheDataWasCaptured, data: DataFromCertainPointInTime): VPromise // we accept it as an argument since if we are capturing the time ourselves we eill capture it at the moment when the data arrives not when it was actually captured, here we will add all periodic data to the cache (we can even store it into one single entry which consists of the a certain timestamp and just add to it)
}