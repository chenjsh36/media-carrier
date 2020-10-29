export function createTimeoutPromise(time) {
    return new Promise(function (resolve) {
        return setTimeout(function () {
            resolve();
        }, time);
    });
}
export function timeout(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () { return reject(new Error("timeout in " + time + " millseconds!")); }, time);
    });
}
/**
 * transform seconds to time, eg: 1 => "00:00:01.0", 70 => "00:01:10.0"
 * @param sec seconds from video start
 */
export function sec2Time(secs) {
    if (secs < 0) {
        throw new Error('"secs" should be positive integer');
    }
    var sec = secs % 60;
    var min = parseInt("" + secs / 60, 10) % 60;
    var hour = parseInt("" + secs / 3600, 10);
    return padStart(hour.toString(), 2, '0', false) + ":" + padStart(min.toString()) + ":" + padStart(sec.toString()) + ".0";
}
/**
 * transform time to milliseconds, eg: "00:00:01" => 1
 * @param time 'hh:mm:ss.x'
 */
export function time2Sec(time) {
    return parseInt((time2Millisecond(time) / 1000).toString(), 10);
}
/**
 * transform time to milliseconds, eg: "00:00:01" => 1000
 * @param time 'hh:mm:ss.x'
 */
export function time2Millisecond(time) {
    var _a = time.split(':').map(function (str) { return parseFloat(str); }), hour = _a[0], minute = _a[1], second = _a[2];
    var millisecond = 0;
    millisecond += second * 1000;
    millisecond += minute * 60 * 1000;
    millisecond += hour * 60 * 60 * 1000;
    return millisecond;
}
/**
 * like es7 <string>.padStart
 * @param str
 * @param len
 * @param val
 * @param isFreezeLen
 */
export function padStart(str, len, val, isFreezeLen) {
    if (str === void 0) { str = ''; }
    if (len === void 0) { len = 2; }
    if (val === void 0) { val = '0'; }
    if (isFreezeLen === void 0) { isFreezeLen = true; }
    if (isFreezeLen === false && str.length >= len) {
        return str;
    }
    return (Array(len).join(val) + str).slice(-len);
}
//# sourceMappingURL=time.js.map