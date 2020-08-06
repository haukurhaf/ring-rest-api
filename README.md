# ring-rest-api
A simple REST API written in Node.js to communicate with Ring Doorbells via HTTP/Web sockets.

# Setup
- Clone repository
- run "npm install"
- Obtain a refresh token for your Ring account, by running this command: "npx -p ring-client-api ring-auth-cli"
- Take the returned refresh token and copy/paste it into the refreshToken property in line 6 in the app.ts file
- run "npm start" to build the app.ts file and run the server, or just run "node ./dist/app.js" to run the compiled JS file

# Usage
The server will bind to port 3000 by default.
Open http://localhost:3000/devices to fetch a list of your doorbells

More details coming soon ...
