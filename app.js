const express = require('express');
const app = express();
const mime = require('mime');

app.use(express.static('.'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8000, function() {
  console.log("Server is running on localhost:8000");
});
