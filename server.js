// let scaled_data;
// const scaled_data = JSON.stringify(require('./mock.json').data);
// const scaled_data = Array(320).fill(Array(320));
// console.log(scaled_data);

// const Buffer = require('buffer').Buffer;
// Method 1
// const { PNG } = require('pngjs');
// const jsqr = require('jsqr');

// const dataUri = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
// const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
// const dataUri = `data:image/gif;base64,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`;
// // let dataUri = '';
// const png = PNG.sync.read(Buffer.from(dataUri.slice('data:image/png;base64,'.length), 'base64'));
// const code = jsqr(Uint8ClampedArray.from(png.data), png.width, png.height);
// console.log(code.data);

// Method 2
// let Uint8ClampedArray = require('typedarray').Uint8ClampedArray;
// global.Buffer = Buffer;
// const jpeg = require('jpeg-js');

// // const jpegData = Buffer.from(base64, 'base64');
// const jpegData = Buffer.from(dataUri, 'base64');
// let rawImagedata = jpeg.decode(jpegData);

// var clampedArray = new Uint8ClampedArray(rawImageData.data.length);
// // manually fill Uint8ClampedArray, cause Uint8ClampedArray.from function is not available in react-native
// var i;
// for (i = 0; i < rawImageData.data.length; i++) {
//   clampedArray[i] = rawImageData.data[i];
// }
// console.log('new array', clampedArray);

// // Method 3  = base64
// // const buff = Buffer.from(base64, 'base64');
// const buff = Buffer.from(dataUri, 'base64');

// // decode buffer as UTF-8
// const str = buff.toString('utf-8');

// // print normal string
// console.log(str);


// Method 4 = blob?

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const http = require("http");
const server = http.createServer(app);
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cors = require('cors');
// const bodyParser = require('body-parser');
let broadcaster;

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

//use cors to allow cross origin resource sharing
app.use(cors({
  origin: `http://localhost:${port}`,
  credentials: true
}));

// IBM Cloud
let tokenResponse, payload;
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

const updateToken = async () => {
  await getToken((err) => console.log(err), function () {
    console.log(`\n running getToken callback`);
    try {
      tokenResponse = JSON.parse(this.responseText);
      console.log('Received tokenResponse', tokenResponse);
    } catch (ex) { console.log(ex) }
  });
}
updateToken();

// Consider securing credentials into environment variables.
function apiPost(scoring_url, IAMtoken, payload, loadCallback, errorCallback) {
  // console.log('running apiPost');
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", loadCallback);
  oReq.addEventListener("error", errorCallback);
  oReq.open("POST", scoring_url);
  oReq.setRequestHeader("Accept", "application/json");
  oReq.setRequestHeader("Authorization", "Bearer " + IAMtoken);
  oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  oReq.send(payload);
}

// const arrayAnalyzer = (arr) => console.log(`width: arr[0].length; height: arr.length`)};

// const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/5e5869da-361e-4303-9e8c-0b55053b10cb/predictions?version=2021-08-17";
const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/c22a21e5-f590-471b-9fa7-e03412b87769/predictions?version=2021-08-20";
const getPrediction = () => apiPost(scoring_url, tokenResponse.access_token, payload,
  function (resp) {
    console.log('run CB for getPrediction');
    let parsedPostResponse, values;
    try {
      parsedPostResponse = JSON.parse(this.responseText);
      console.log("\nScoring response", parsedPostResponse);

      let pred = parsedPostResponse.predictions;
      if (pred && pred[0]) {
        console.log("\nPredictions", parsedPostResponse.predictions);
        values = parsedPostResponse.predictions[0].values;

        // Sample "values": [
        //   [
        //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ],
        //     2,
        //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ]
        //   ]
        // ]
        // Note: Swing gestures use flat hand, NOT finger pointing.
        console.log('values', values);
        const confidenceThreshold = 0.6,
          confidenceArr = values[0][0],
          signals = {
            0: "Stop & Hold",
            1: "Boom Up",
            2: "Boom Down",
            3: "Swing Left",
            4: "Swing Right"
          };
        let maxIndex = values[0][1];

        if (confidenceArr[maxIndex] < confidenceThreshold) {
          maxIndex = 0;
        }
        io.socket.emit("send-prediction", signals[maxIndex], maxIndex === 0);
        io.socket.broadcast.emit("send-prediction", signals[maxIndex], maxIndex === 0);

        // return parsedPostResponse;
      }

      if (values) {
        console.log('\nparsedPostResponse.predictions[0].values', values);
      }
    } catch (ex) { console.log(ex) }
  }, function (error) {
    console.log(error);
  }
);

// Note: Token expires every 1 hour (3600 sec).
setInterval(async () => {
  console.time('get token');
  updateToken();
  console.timeEnd('get token');
}, (3600 * 1000));

// Real Time Connection
io.sockets.on("error", e => console.log(e));

io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;

    // const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/5e5869da-361e-4303-9e8c-0b55053b10cb/predictions?version=2021-08-17";

    // // Consider securing credentials into environment variables.

    // function apiPost(scoring_url, IAMtoken, payload, loadCallback, errorCallback) {
    //   const oReq = new XMLHttpRequest();
    //   oReq.addEventListener("load", loadCallback);
    //   oReq.addEventListener("error", errorCallback);
    //   oReq.open("POST", scoring_url);
    //   oReq.setRequestHeader("Accept", "application/json");
    //   oReq.setRequestHeader("Authorization", "Bearer " + IAMtoken);
    //   oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //   oReq.send(payload);
    // }

    // // const arrayAnalyzer = (arr) => console.log(`width: arr[0].length; height: arr.length`)};

    // const getPrediction = () => apiPost(scoring_url, tokenResponse.access_token, payload,
    //   function (resp) {
    //     let parsedPostResponse, values;
    //     try {
    //       parsedPostResponse = JSON.parse(this.responseText);
    //       values = parsedPostResponse.predictions[0].values;
    //     } catch (ex) { console.log(ex) }
    //     // console.log("\nScoring response", parsedPostResponse);
    //     // console.log("\nPredictions", parsedPostResponse.predictions);
    //     console.log('\nparsedPostResponse.predictions[0].values', values);

    //     // Sample "values": [
    //     //   [
    //     //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ],
    //     //     2,
    //     //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ]
    //     //   ]
    //     // ]
    //     // Note: Swing gestures use flat hand, NOT finger pointing.
    //     const confidenceThreshold = 0.6,
    //       confidenceArr = values[0][0],
    //       signals = {
    //         0: "Stop & Hold",
    //         1: "Boom Up",
    //         2: "Boom Down",
    //         3: "Swing Left",
    //         4: "Swing Right"
    //       };
    //     let maxIndex = values[0][1], isStop;

    //     if (confidenceArr[maxIndex] < confidenceThreshold) {
    //       maxIndex = 0;
    //     }
    //     socket.emit("send-prediction", signals[maxIndex], maxIndex === 0);
    //     socket.broadcast.emit("send-prediction", signals[maxIndex], maxIndex === 0);

    //     return parsedPostResponse;
    //   }, function (error) {
    //     console.log(error);
    //   }
    // );

    // Send to API the values to be scored.
    // payload = `{"input_data": [{"fields": [], "values": [${scaled_data}]}]}`;

    // const framesPerSec = 0.35;
    // console.timeEnd('getting token');
    // });

    // Poll API once broadcaster connects
    // if (typeof (tokenResponse.access_token) !== 'undefined') { // check for access token}

    socket.on("send-array", async (arr) => {
      console.time('getPrediction');
      payload = `{"input_data": [{"fields": [], "values": ["${arr}"]}]}`;
      console.log('payload', payload);
      // `{"input_data": [{"fields": [], "values": ["xxxxx"]}]}`
      await getPrediction();
      console.timeEnd('getPrediction');
    });

    socket.broadcast.emit("broadcaster");
  });

  // CAUSES RAPID FIRE ISSUE?
  // socket.on("send-array", async (arr) => {
  //   // console.log('GOT ARRAY OUTSIDE on-broadcaster');
  //   console.log('Sending array');
  //   // console.time('getPrediction');
  //   payload = `{"input_data": [{"fields": [], "values": [${arr}]}]}`;
  //   await getPrediction();
  //   // console.timeEnd('getPrediction');
  // });

  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });

  socket.on("test", msg => {
    // console.log('server got', msg);
    socket.broadcast.emit("update-prediction", msg);
  });

  socket.on("disconnect", () => {
    // socket.to(broadcaster).emit("disconnectPeer", socket.id);
    socket.emit("disconnectPeer", socket.id);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
