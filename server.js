const scaled_data = JSON.stringify(require('./mock.json').data);

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const http = require("http");
const server = http.createServer(app);
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let broadcaster;

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

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

    const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/5e5869da-361e-4303-9e8c-0b55053b10cb/predictions?version=2021-08-17";

    // Consider securing credentials into environment variables.

    function apiPost(scoring_url, IAMtoken, payload, loadCallback, errorCallback) {
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

    const getPrediction = () => apiPost(scoring_url, tokenResponse.access_token, payload,
      function (resp) {
        let parsedPostResponse, values;
        try {
          parsedPostResponse = JSON.parse(this.responseText);
          values = parsedPostResponse.predictions[0].values;
        } catch (ex) { console.log(ex) }
        // console.log("\nScoring response", parsedPostResponse);
        // console.log("\nPredictions", parsedPostResponse.predictions);
        console.log('\nparsedPostResponse.predictions[0].values', values);

        // Sample "values": [
        //   [
        //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ],
        //     2,
        //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ]
        //   ]
        // ]
        // Note: Swing gestures use flat hand, NOT finger pointing.
        const confidenceThreshold = 0.7,
          confidenceArr = values[0][0],
          signals = {
            0: "Stop & Hold",
            1: "Boom Up",
            2: "Boom Down",
            3: "Swing Left",
            4: "Swing Right"
          };
        let maxIndex = values[0][1], isStop;

        if (confidenceArr[maxIndex] < confidenceThreshold) {
          maxIndex = 0;
        }
        socket.emit("send-prediction", signals[maxIndex], maxIndex === 0);
        socket.broadcast.emit("send-prediction", signals[maxIndex], maxIndex === 0);

        return parsedPostResponse;
      }, function (error) {
        console.log(error);
      }
    );

    // Note: Token expires every 1 hour.
    // console.time('getting token');
    // getToken((err) => console.log(err), function () {
    //   console.log(`\n running getToken callback`);
    //   try {
    //     tokenResponse = JSON.parse(this.responseText);
    //     console.log('Received tokenResponse', tokenResponse);
    //   } catch (ex) {
    //     // TODO: handle parsing exception
    //   }

    // Send to API the values to be scored.
    payload = `{"input_data": [{"fields": [], "values": [${scaled_data}]}]}`;

    const framesPerSec = 0.35;
    // console.timeEnd('getting token');
    setInterval(async () => {
      console.time('getPrediction');
      await getPrediction();
      console.timeEnd('getPrediction');
    }, (1000 / framesPerSec));
    // });

    // Poll API once broadcaster connects
    // if (typeof (tokenResponse.access_token) !== 'undefined') { // check for access token}

    socket.broadcast.emit("broadcaster");
  });

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
