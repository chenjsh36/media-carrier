import _ from 'lodash';
import MediaCarrier, { Utils } from 'media-carrier';

let inputFileFormatType = 'mp4';
let videoSize = {
  width: 0,
  height: 0,
}

function getVideoDuration(video) {
  return new Promise((resolve) => {
    let videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.addEventListener('loadedmetadata', () => {
      window.URL.revokeObjectURL(videoElement.src);
      const duration = videoElement.duration;
      videoElement = null;
      resolve(duration);
    })
    videoElement.src = window.URL.createObjectURL(video);
  })
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

window.cutVideo = async () =>  {
  const mc = new MediaCarrier();

  await mc.open({
    workerPath: '/static/ffmpeg-worker-mp4.js',
    mediaType: inputFileFormatType,
  });

  const blob = await readVideo();

  const startInput = document.querySelector('#cut-video-start-input');
  const endInput = document.querySelector('#cut-video-end-input');
  const start = startInput.value || '00:00:00.0';
  const end = endInput.value || '00:00:10.0';
  const beginTime = Date.now();
  const { blob: clippedBlob, logs, arrayBuffer: clippedArrayBuffer } = await mc.clip(blob, {
    startTime: start,
    duration: end,
    mediaType: 'video',
    formatType: inputFileFormatType,
    width: videoSize.width > 1024 ? 1024 : videoSize.width
  });
  console.log('LOGS:', clippedBlob, logs, clippedArrayBuffer, clippedArrayBuffer.byteLength, clippedArrayBuffer.length);
  const clippedVideoUrl = Utils.blob2ObjectURL(clippedBlob);
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

  const clippedBlobDuration = await getVideoDuration(clippedBlob);

  const afterText = document.createTextNode(`原始视频（${videoSize.width} x ${videoSize.height}）经过 ${duration} s 处理后的视频(大小：${(clippedBlob.size / 1000 / 1000).toFixed(2)}MB), 真实时长： ${clippedBlobDuration}:`);

  template.appendChild(afterText);
  template.appendChild(clippedVideo);
  template.appendChild(slippedLink);

  span.appendChild(template);
  mc.close();
}

window.calcVideoMD5 = async () => {
  const mc = new MediaCarrier();
  const blob = await readVideo();
  const md5Value = await mc.md5(blob);
  console.log('MD5:', md5Value);
}

window.calcMD5G = Utils.calcMD5;
window.blob2ArrayBuffer = Utils.blob2ArrayBuffer;


window.runCommand = async () => {
  console.log('run command', Date.now());
  const mc = new MediaCarrier();

  await mc.open({
    workerPath: '/static/ffmpeg-worker-mp4.js',
    mediaType: inputFileFormatType,
  });

  const blob = await readVideo();
  const result = await mc.runCommands(blob, { formatType: 'mp4', args: ['-i', 'input.mp4']})
  console.log('result:', result, Date.now());
}