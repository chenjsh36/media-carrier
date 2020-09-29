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
 * transform seconds to time, eg: 1 => 00:00:01.0, 70 => 00:01:10.0
 * @param sec seconds from video start
 */
export function sec2Time(secs) {
    var sec = secs % 60;
    var min = parseInt("" + secs / 60, 10) % 60;
    var hour = parseInt("" + secs / 3600, 10);
    return padStart(hour.toString()) + ":" + padStart(min.toString()) + padStart(sec.toString()) + ".0";
}
export function padStart(str, len, val) {
    if (str === void 0) { str = ''; }
    if (len === void 0) { len = 2; }
    if (val === void 0) { val = '0'; }
    return (Array(len).join(val) + str).slice(-len);
}
//# sourceMappingURL=common.js.map