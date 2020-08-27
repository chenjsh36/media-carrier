import _ from 'lodash';
import SparkMD5 from 'spark-md5';
import MediaCarrier, { Utils } from 'media-carrier';

let inputFileFormatType = 'mp4';
let videoSize = {
  width: 0,
  height: 0,
}

const video = document.querySelector('#cut-video-before-show');
video.addEventListener('loadedmetadata', function(e) {
  console.log('video length:', video, e, video.videoHeight, video.videoWidth);
  videoSize = {
    height: video.videoHeight,
    width: video.videoWidth,
  }
})

window.handleFileChange = () => {
  const input = document.querySelector('#cut-video-input');
  const video = document.querySelector('#cut-video-before-show');
  if (!input.files[0]) return;
  const url = URL.createObjectURL(input.files[0]);
  const [inputName, inputFormatType] = input.files[0].name.split('.');
  inputFileFormatType = inputFormatType;
  video.src = url;
}

window.readVideo = async () =>  {
  return new Promise((resolve, reject) => {
    const input  = document.querySelector('#cut-video-input');
    resolve(input.files[0])
  })
}
window.cutMulVideo = async() => {
  for (let i = 0; i < 100; i++) {
    cutVideo();
  }
}
window.cutVideo = async () =>  {
  const mc = new MediaCarrier();

  // 启动audioSculptor
  await mc.open({
    workerPath: '/static/ffmpeg-worker-mp4.js',
    mediaType: inputFileFormatType,
  });

  const blob = await readVideo();

  const startInput = document.querySelector('#cut-video-start-input');
  const endInput = document.querySelector('#cut-video-end-input');
  const start = startInput.value || '00:00:00.0';
  const end = endInput.value || '10';
  const beginTime = Date.now();
  const { blob: clippedBlob, logs, arrayBuffer: clippedArrayBuffer } = await mc.mediaSpaceClip(blob, {
    startTime: start,
    endTime: end,
    mediaType: 'video',
    formatType: inputFileFormatType,
    width: videoSize.width > 1024 ? 1024 : videoSize.width
  });
  console.log('LOGS:', clippedBlob, logs, clippedArrayBuffer, clippedArrayBuffer.byteLength, clippedArrayBuffer.length);
  const clippedVideoUrl = await Utils.blob2ObjectURL(clippedBlob);
  const clippedVideo = document.createElement('video');
  clippedVideo.src = clippedVideoUrl;
  clippedVideo.controls = true;

  const slippedLink = document.createElement('a');
  slippedLink.download = 'output.mp4';
  slippedLink.href = clippedVideoUrl;
  slippedLink.innerHTML = '下载';

  const duration = (Date.now() - beginTime) / 1000;  
  const span = document.querySelector('#cut-video-doing-text');
  const template = document.createDocumentFragment();

  const afterText = document.createTextNode(`原始视频（${videoSize.width} x ${videoSize.height}）经过 ${duration} s 处理后的视频(大小：${(clippedBlob.size / 1000 / 1000).toFixed(2)}MB):`);

  const md5BeginTime = Date.now();
  // const newMd5Value = await mc.md5(blob, { formatType: inputFileFormatType });
  // console.log('new Md5Value:', newMd5Value);
  const md5Value = calcMD5(clippedArrayBuffer);
  const md5Duration = (Date.now() - md5BeginTime) / 1000;
  const md5Text = document.createTextNode(`经过${md5Duration} s 计算出 MD5 值为 ${md5Value}`)

  template.appendChild(afterText);
  template.appendChild(clippedVideo);
  template.appendChild(slippedLink);
  template.appendChild(md5Text);

  span.appendChild(template);
  mc.close();
}

function calcMD5( arrayBuffer ) {
  const cSize = 2097152; // 2 MB
  const fSize = arrayBuffer.byteLength;
  const chunks = Math.ceil(fSize / cSize);

  const spark = new SparkMD5.ArrayBuffer();

  for (let i = 0; i < chunks; i++) {
    let start = i * cSize;
    let end = (start + cSize) >= fSize ? fSize : start + cSize;
    let sliceBuffer = arrayBuffer.slice(start, end);
    spark.append(sliceBuffer);
  }
  return spark.end();
}