import { RingApi } from 'ring-client-api'
import express from 'express';
import socket from 'socket.io';

const ringApi = new RingApi({
  refreshToken: "",
  cameraStatusPollingSeconds: 20,
  cameraDingsPollingSeconds: 2,
});

const _RingDevices = [];
let _Cameras = [];
const _allWSClients = [];

const app = express();
const port = 3000;

const server = app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});

var io = socket(server);

ringApi.getCameras().then((cameras) => {  
  _Cameras = cameras;

  cameras.forEach(camera => {    
    _RingDevices.push({
      'name': camera.name,
      'deviceType': camera.deviceType
    });

    camera.onDoorbellPressed.subscribe({
      next(activeDing) {
        if (activeDing)
        {
          console.log('There is someone at your ' + camera.name);
          console.log(activeDing);
          io.sockets.emit('doorbellPressed', activeDing);
        }
      },
      error(err) {
        console.error('Ring error @ ' + camera.name + '(' + err + ')');
      },
      complete() {
        console.log('Ring @ ' + camera.name + ' done!');
      }
    });

    camera.onMotionDetected.subscribe({
      next(isMotion) {
        if (isMotion)
        {
          console.log('There is motion at your ' + camera.name);
          io.sockets.emit('doorbellMotion', {'camera': camera.name});
        }
      },
      error(err) {
        console.error('Motion error @ ' + camera.name + '(' + err + ')');
      },
      complete() {
        console.log('Motion @ ' + camera.name + ' done!');
      }
    });
  });
});

io.on('connection', function(socket) {
    _allWSClients.push(socket);
    console.log('A client has connected - there are now ' + _allWSClients.length + ' clients connected!');
    
    socket.on('disconnect', function() {      
      var i = _allWSClients.indexOf(socket);
      _allWSClients.splice(i, 1);
      
      console.log('A client has disconnected - there are now ' + _allWSClients.length + ' clients connected!');
   });    
});

app.get('/devices', async (req, res) => {
  res.send(_RingDevices);
});

app.get('/device/:device', async (req, res) => {
  var deviceName = req.params.device;
  res.send(_RingDevices.filter(x => x.name == deviceName));
});

app.get('/device/:device/health', async (req, res) => {
  var deviceName = req.params.device;
  var camera = _Cameras.find(x => x.name == deviceName);
  if (camera)
  {
    camera.getHealth().then((data) => {
      res.send(data);
    });  
  }
  else res.send('Device not found!');
});

app.get('/device/:device/liveview', async (req, res) => {
  var deviceName = req.params.device;
  var camera = _Cameras.find(x => x.name == deviceName);
  if (camera)
  {
    camera.startVideoOnDemand().then((data) => {
      console.log(data);
    });  
  }
  else res.send('Device not found!');
});

app.get('/device/:device/events', async (req, res) => {
  var deviceName = req.params.device;
  var camera = _Cameras.find(x => x.name == deviceName);
  if (camera)
  {
    camera.getEvents({
      limit: 50,
      state: 'accepted'
    }).then((data) => {
      res.send(data);
    });  
  }
  else res.send('Device not found!');
});


app.get('/device/:device/:dingId/url', async (req, res) => {
  var deviceName = req.params.device;
  var dingId = req.params.dingId;
  var camera = _Cameras.find(x => x.name == deviceName);
  if (camera)
  {
    camera.getRecordingUrl(dingId, { transcoded: true }).then((data) => {
      res.send({'url': data });
    });  
  }
  else res.send('Device not found!');
});