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
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", loadCallback);
  oReq.addEventListener("error", errorCallback);
  oReq.open("POST", scoring_url);
  oReq.setRequestHeader("Accept", "application/json");
  oReq.setRequestHeader("Authorization", "Bearer " + IAMtoken);
  oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  oReq.send(payload);
}


// Note: Token expires every 1 hour (3600 sec).
setInterval(async () => {
  updateToken();
}, (3600 * 1000));

// Real Time Connection
io.sockets.on("error", e => console.log(e));

io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;

    const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/c22a21e5-f590-471b-9fa7-e03412b87769/predictions?version=2021-08-20";
    const getPrediction = () => apiPost(scoring_url, tokenResponse.access_token, payload,
      function (resp) {
        // console.log('run CB for getPrediction');
        let parsedPostResponse, values;
        try {
          parsedPostResponse = JSON.parse(this.responseText);
          values = parsedPostResponse.predictions[0].values;

          // Sample "values": [
          //   [
          //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ],
          //     2,
          //     [ 0.0, 1.4365383181056576e-37, 1.0, 0.0, 0.0 ]
          //   ]
          // ]
          // Note: Swing gestures use flat hand, NOT finger pointing.
          // console.log('values', values);
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

          console.log('confidence', confidenceArr);

          if (confidenceArr[maxIndex] < confidenceThreshold) {
            maxIndex = 0;
          }
          console.log(`maxIndex shows ${signals[maxIndex]}`);
          socket.emit("send-prediction", signals[maxIndex], maxIndex === 0);
          socket.broadcast.emit("send-prediction", signals[maxIndex], maxIndex === 0);

        } catch (ex) { console.log(ex) }
      }, function (error) { console.log(error) }
    );


    socket.on("send-array", async (arr) => {
      console.time('getPrediction');
      // Note: `{"input_data": [{"fields": [], "values": ["xxxxx"]}]}`
      payload = `{"input_data": [{"fields": [], "values": ["${arr}"]}]}`;
      await getPrediction();
      console.timeEnd('getPrediction');
    });

    socket.broadcast.emit("broadcaster");
  });

  // CAUSES RAPID FIRE ISSUE?
  // socket.on("send-array", async (arr) => { ... });

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

  socket.on("disconnect", () => {
    // socket.to(broadcaster).emit("disconnectPeer", socket.id);
    socket.emit("disconnectPeer", socket.id);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
