
# media-carrier

media-carrier is used to record, convert and stream audio and video. Also offer some tools to convert binary file, time transform and so on.

## Installation

```
npm install --save media-carrier
```

## Usage


### Cut Video

``` javascript
import MediaCarrier, { Utils } from 'media-carrier';

const { sec2Time, blob2ObjectURL } = Utils;

const mc = new MediaCarrier();
await mc.open({
  workerPath: '/static/ffmpeg-worker-mp4.js', // Script URL should obey the same-origin-policy. see more https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/Worker
})

const $input = document.querySelector('#input');
const file = $input.files[0];

const { blob } = await mc.clip(file, {
  startTime: sec2Time(0), // '00:00:00.0'
  duration: sec2Time(10), // '00:00:10.0'
  mediaType: 'video',
  formatType: 'mp4',
});

const newVideoURL = blob2ObjectURL(blob);
document.querySelector('#video').src = newVideoURL;

```

### Calculate file md5

``` javascript
import MediaCarrier, { Utils } from 'media-carrier';

const mc = new MediaCarrier();

const $input = document.querySelector('#input');
const file = $input.files[0];

const { md5 } = await mc.md5(file);

```

### Run FFmpeg Commnands directly

``` javascript

import MediaCarrier, { Utils } from 'media-carrier';

const mc = new MediaCarrier();

const $input = document.querySelector('#input');
const file = $input.files[0];

const { blob, logs } = await mc.runCommands(file, {
  formatType: 'mp4',
  args: ["-i", "test.mp4", "-c:v", "libvpx", "-an", "out.mp4"],
});
```

## Utils

### Utils.arrayBuffer2Blob

### Utils.arrayBuffer2File

### Utils.blob2ArrayBuffer

### Utils.blob2ObjectURL

### Utils.blob2AudioEelemnt

### Utils.blob2VideoElement

### Utils.sec2Time

### Utils.time2Sec

### Utils.getVideoDuration

## run demo

```
npm run compile:watch
npm run dev
npm link
```

Go to demo 

```
npm link media-carrier
npm run start
```