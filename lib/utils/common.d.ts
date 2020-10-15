export declare function createTimeoutPromise(time: number): Promise<void>;
export declare function timeout(time: number): Promise<Error>;
/**
 * transform seconds to time, eg: 1 => "00:00:01.0", 70 => "00:01:10.0"
 * @param sec seconds from video start
 */
export declare function sec2Time(secs: number): string;
/**
 * transform time to milliseconds, eg: "00:00:01" => 1
 * @param time 'hh:mm:ss.x'
 */
export declare function time2Sec(time: string): number;
/**
 * transform time to milliseconds, eg: "00:00:01" => 1000
 * @param time 'hh:mm:ss.x'
 */
export declare function time2Millisecond(time: string): number;
/**
 * like es7 <string>.padStart
 * @param str
 * @param len
 * @param val
 * @param isFreezeLen
 */
export declare function padStart(str?: string, len?: number, val?: string, isFreezeLen?: boolean): string;
