import type { TimeFrame } from "../../models/TimeFrame"
import type { User } from "../../models/User"
import type { Optional } from "../../utils/Optional"
import type { OptionalPromise } from "../../utils/types/customPromises/OptionaPromise"
import type { VPromise } from "../../utils/types/customPromises/VPromise"


type timestamp = string

export type DataFromCertainPointInTime = {
    position: {
        offestAccordingToPreviousReading: {
            x: number,
            y: number,
            z: number
        }
    },
    acceleration: {},
    nadmorskaVisochina: {},
    compas: {},
    location: {
        lat: number,
        long: number, 
    },
    tempreratureMetadata: {
        humidity: number
        pressure: number,
        temperature: number
    },
    proximity: number
    radiation: number
    BPM: number
    picture: "url" 
}

export interface IGuardedService{
    getData(timeFrame: TimeFrame): OptionalPromise<{
        [x: timestamp]: DataFromCertainPointInTime
    }>
    addData(): VPromise
    get(id: Optional<string>): OptionalPromise<User[]>
}