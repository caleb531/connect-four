/* eslint-disable no-console */
var express = require('express');
var app = express();
var server = require('http').Server(app);

// WARNING: app.listen(8080) will NOT work here!
server.listen(8080, () => {
  console.log('Server started. Listening on port 8080');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname));
