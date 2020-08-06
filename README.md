# ring-rest-api
A simple REST API written in Node.js to communicate with Ring Doorbells via HTTP/Web sockets.

# Why?
I have a custom built home automation dashboard at home which integrates with all of my smart devices and provides a slick interface to control and monitor all kinds of stuff, including opening my front door (via an electric magnetic lock). The only thing missing was integration with my Ring doorbells.  That's why I wrote this simple REST API, which acts as a "proxy" between the Ring Cloud API and my home automation dashboard.

# Setup
- Clone repository
- run "npm install"
- Obtain a refresh token for your Ring account, by running this command: "npx -p ring-client-api ring-auth-cli"
- Take the returned refresh token and copy/paste it into the refreshToken property in line 6 in the app.ts file
- run "npm start" to build the app.ts file and run the server, or just run "node ./dist/app.js" to run the compiled JS file

# Usage
The server will bind to port 3000 by default.
Make a GET request to http://localhost:3000/devices to fetch a list of your doorbells
Make a GET request to http://localhost:3000/device/<device name>/health to get health information for that device
Make a GET request to http://localhost:3000/device/<device name>/liveview to initiate a live stream for that device (only returns livestream metadata at the moment)
Make a GET request to http://localhost:3000/device/<device name>/events to fetch a list of events (motion/rings/liveviews) for that device
Make a GET request to http://localhost:3000/device/<device name>/<dingId>/url to fetch the video URL of the given dingId for the given device (dingId is the dingIdStr returned by the events request)

# Web sockets
A web socket connection can be established to the server and all connected clients will then receive events when motion is detected or the doorbells are rung.

The events are called "doorbellPressed" and "doorbellMotion".

# Thanks

All of the heavy lifting is done by this library here by @dgreif https://github.com/dgreif/ring
