// DOM
const predictionContainer = document.querySelector('.prediction-container');
const predictionText = document.getElementById('prediction');

// const framesPerSec = 0.35;
const framesPerSec = 0.2;

const peerConnections = {};
const config = {
  iceServers: [
    {
      "urls": "stun:stun.l.google.com:19302",
    },
    // { 
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ]
};

const socket = io.connect(window.location.origin);

socket.on("answer", (id, description) => {
  peerConnections[id].setRemoteDescription(description);
});

socket.on("watcher", id => {
  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;

  let stream = videoElement.srcObject;
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };

  peerConnection
    .createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("offer", id, peerConnection.localDescription);
    });
});

socket.on("candidate", (id, candidate) => {
  peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("send-prediction", (signal, isStopSignal) => {
  console.log('broadcast got signal', signal);
  predictionText.textContent = signal;

  isStopSignal
    ? predictionContainer.setAttribute('data-signal', 'stop')
    : predictionContainer.setAttribute('data-signal', 'has-signal');
});

socket.on("disconnectPeer", id => {
  peerConnections[id].close();
  delete peerConnections[id];

  socket.emit("disconnect-watcher", () => {
    console.log(`discon. watcher`);
  });
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

// Get camera and microphone
const videoElement = document.querySelector("video");
const audioSelect = document.querySelector("select#audioSource");
const videoSelect = document.querySelector("select#videoSource");

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

getStream()
  .then(getDevices)
  .then(gotDevices);

function getDevices() {
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos;
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement("option");
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "audioinput") {
      option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === "videoinput") {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}

function getStream() {

  // Stop any existing stream
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const audioSource = audioSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
    video: {
      deviceId: videoSource ? { exact: videoSource } : undefined,
      // aspectRatio: 1,
      facingMode: "user"
    }
  };
  return navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

function gotStream(stream) {
  window.stream = stream;
  audioSelect.selectedIndex = [...audioSelect.options].findIndex(
    option => option.text === stream.getAudioTracks()[0].label
  );
  videoSelect.selectedIndex = [...videoSelect.options].findIndex(
    option => option.text === stream.getVideoTracks()[0].label
  );
  videoElement.srcObject = stream;
  socket.emit("broadcaster");

  document.querySelector('.fetch-demo--heading').textContent += ` @ ${framesPerSec} fps`;

  const capturedCanvas = document.getElementById('capture');
  const track = stream.getVideoTracks()[0];
  let imageCapture = new ImageCapture(track);

  async function drawCanvas(canvas, img) {
    const ctx = canvas.getContext('2d');

    // Match canvas size to image size
    // canvas.width = getComputedStyle(canvas).width.split('px')[0];
    // canvas.height = getComputedStyle(canvas).height.split('px')[0];
    // let ratio = Math.max(canvas.width / img.width, canvas.height / img.height);

    // Resize canvas to 320 x 320px
    canvas.width = 320;
    canvas.height = 320;
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);

    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.drawImage(img, 0, 0, img.width, img.height,
    //   x, y, img.width * ratio, img.height * ratio);
    ctx.drawImage(img, 0, 0, 320, 320);

    /**
     * @returns ImageData object. 
     */
    // let imgPixels = ctx.getImageData(0, 0, img.width, img.height);
    let imgPixels = ctx.getImageData(0, 0, 320, 320);

    /**
     * Iterate through Uint8ClampedArray in the ImageData; change colors to grayscale.
     * This does not remove RGB values in ImageData.data, only matches color to gray.
     * Also Convert Uint8ClampedArray to standard 320 x 320 nested array.
     */
    for (let row = 0; row < imgPixels.height; row++) {
      for (let col = 0; col < imgPixels.width; col++) {
        let i = (row * 4) * imgPixels.width + col * 4;
        let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        imgPixels.data[i] = avg;
        imgPixels.data[i + 1] = avg;
        imgPixels.data[i + 2] = avg;
      }
    }

    // redraw the new computed image
    await ctx.putImageData(imgPixels, 0, 0);
    // console.log(imgPixels);

    // console.log('scaledArray.length', scaledArray.length);

    // length..
    // scaledArray = [1, 2, 3];
    // scaledArray = Array.from(imgPixels.data); // no good
    // scaledArray = Array(100000).fill(1); // works
    // scaledArray = Array(200000); // doesn't work

    // type..
    // console.log(typeof scaledArray);
    // scaledArray = JSON.stringify(scaledArray);
    // console.log(typeof scaledArray);

    scaledArray = canvas.toDataURL().split('base64,')[1]; // converts to image/png:base64
    // console.log(`Got base64 ${scaledArray.length} chars long.`);
    // console.log(typeof (scaledArray));
    // console.log(scaledArray);

    // Emit array for scoring
    socket.emit("send-array", scaledArray);

    // console.log('sent array');
    // }();

    // Resize grayscaled canvas
    // canvas.width = 320;
    // canvas.height = 320;
    // const resized = ctx.getImageData(0, 0);
    // console.log(resized.data);
  }

  // const captureAndFetchPrediction = async (capture, canvas) => {
  const captureImage = async (capture, canvas) => {
    try {
      await capture.grabFrame()
        .then(bitmap => drawCanvas(canvas, bitmap))

      // TODO: Determine required image processing; return a 320 x 320 matrix.

      // .then(img => getPrediction(img))
    } catch (err) {

      // ignore errors during async process
      return
    }
  };

  const captureAndFetchPrediction = async () => {
    await captureImage(imageCapture, capturedCanvas);
    return
  };

  setInterval(captureAndFetchPrediction, (1000 / framesPerSec));
}

function handleError(error) {
  console.error("Error: ", error);
}
