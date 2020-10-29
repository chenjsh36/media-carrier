import SparkMD5 from 'spark-md5';
export function calcMD5(arrayBuffer) {
    var cSize = 2097152; // 2 MB
    var fSize = arrayBuffer.byteLength;
    var chunks = Math.ceil(fSize / cSize);
    var spark = new SparkMD5.ArrayBuffer();
    for (var i = 0; i < chunks; i++) {
        var start = i * cSize;
        var end = (start + cSize) >= fSize ? fSize : start + cSize;
        var sliceBuffer = arrayBuffer.slice(start, end);
        spark.append(sliceBuffer);
    }
    return spark.end();
}
//# sourceMappingURL=md5.js.map