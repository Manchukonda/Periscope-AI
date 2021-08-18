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
      aspectRatio: 1,
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

  // Test conversion
  let framesPerSec = 15;
  document.querySelector('.fetch-demo--heading').textContent += ` @ ${framesPerSec} fps`;

  // const captureAndFetchPrediction = async () => {
  const test = async () => {
    // await captureImage(imageCapture, capturedCanvas);
    // await getPrediction();

    let val = await new Date().getTime();
    // console.log(`running test. val is ${val}`);
    socket.emit("test", val);
  };

  let imageCapture;
  const capturedCanvas = document.getElementById('capture');
  const track = stream.getVideoTracks()[0];
  imageCapture = new ImageCapture(track);
  // const predictionText = document.getElementById('prediction');

  function drawCanvas(canvas, img) {
    const ctx = canvas.getContext('2d');

    canvas.width = getComputedStyle(canvas).width.split('px')[0];
    canvas.height = getComputedStyle(canvas).height.split('px')[0];
    // let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
      x, y, img.width * ratio, img.height * ratio);

    // var imgPixels = ctx.getImageData(0, 0, img.Width, img.height);
    let imgPixels = ctx.getImageData(0, 0, 320, 320);
    for (let vert = 0; vert < imgPixels.height; vert++) {
      for (let hor = 0; hor < imgPixels.width; hor++) {
        let i = (vert * 4) * imgPixels.width + hor * 4;
        let avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
        imgPixels.data[i] = avg;
        imgPixels.data[i + 1] = avg;
        imgPixels.data[i + 2] = avg;
      }
    }
    // redraw the new computed image
    ctx.putImageData(imgPixels, 0, 0);
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

  /* IBM API functions.

  TODO: 
  // 1. Complete the API call functions and replace getPrediction with them.
  // 2. Consider moving them to server side.
  // 3. Consider securing credentials into environment variables.

  // NOTE: you must manually enter your API_KEY below using information retrieved from your IBM Cloud
  const API_KEY = "7FYHxt6l5EPUVngbLrFALYZNCs-5O8GgkuMYnx6Ge-h3";

  function getToken(errorCallback, loadCallback) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", loadCallback);
    req.addEventListener("error", errorCallback);
    req.open("POST", "https://iam.cloud.ibm.com/identity/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/json");
    req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
  }

  function apiPost(scoring_url, token, payload, loadCallback, errorCallback) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("POST", scoring_url);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", "Bearer " + token);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send(payload);
  }

  getToken((err) => console.log(err), function () {
    let tokenResponse;
    try {
      tokenResponse = JSON.parse(this.responseText);
    } catch (ex) {
      // TODO: handle parsing exception
    }

    // NOTE: manually define and pass the array(s) of values to be scored in the next line
    const payload = `{"input_data": [{"fields": [], "values": [${scaled_data}]}]}`;
    const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/5e5869da-361e-4303-9e8c-0b55053b10cb/predictions?version=2021-08-17";

    apiPost(scoring_url, tokenResponse.token, payload, function (resp) {
      let parsedPostResponse;
      try {
        parsedPostResponse = JSON.parse(this.responseText);
      } catch (ex) {
        // TODO: handle parsing exception
        console.log(ex);
      }
      console.log("Scoring response");
      console.log(parsedPostResponse);
      return parsedPostResponse;
    }, function (error) {
      console.log(error);
    });
  });
  */


  /*
  // Get prediction from API
  let priorState = '', newState = '';
  const getPrediction = async (image) => {
    const apiEndpoint = 'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/129d9321-87f6-4f02-bed0-8430ac98f90e/predictions?version=2021-08-13';
    try {
      await fetch(apiEndpoint, {
        mode: 'no-cors',
        method: 'POST',
        body: image
      })
       .then(res => {

         // TODO: if a gesture is detected and confidence is high, "has-signal" and emit if no gesture is detected or confidence is low, "stop" and emit

       })
    } catch (err) {
      console.log(err);
    }
  };
  */

  const captureAndFetchPrediction = async () => {
    await captureImage(imageCapture, capturedCanvas);
    // await getPrediction();
    return
  };

  setInterval(captureAndFetchPrediction, (1000 / framesPerSec));

  // Broadcast testing only.
  setInterval(test, (1000 / framesPerSec));
}

function handleError(error) {
  console.error("Error: ", error);
}
