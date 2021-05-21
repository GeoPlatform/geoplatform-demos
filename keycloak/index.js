var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Server is up!");
});

var testController = require('./controller/test-controller.js');
app.use('/test', testController);

app.listen(3000);
