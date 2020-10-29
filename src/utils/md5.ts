import SparkMD5 from 'spark-md5';

export function calcMD5( arrayBuffer: ArrayBuffer ) {
  const cSize = 2097152; // 2 MB
  const fSize = arrayBuffer.byteLength;
  const chunks = Math.ceil(fSize / cSize);

  const spark = new SparkMD5.ArrayBuffer();

  for (let i = 0; i < chunks; i++) {
    const start = i * cSize;
    const end = (start + cSize) >= fSize ? fSize : start + cSize;
    const sliceBuffer = arrayBuffer.slice(start, end);
    spark.append(sliceBuffer);
  }
  return spark.end();
}
