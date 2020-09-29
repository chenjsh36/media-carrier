export declare function createTimeoutPromise(time: number): Promise<void>;
export declare function timeout(time: number): Promise<Error>;
/**
 * transform seconds to time, eg: 1 => 00:00:01.0, 70 => 00:01:10.0
 * @param sec seconds from video start
 */
export declare function sec2Time(secs: number): string;
export declare function padStart(str?: string, len?: number, val?: string): string;
