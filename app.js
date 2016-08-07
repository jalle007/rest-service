var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var util = require('util');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');
var multipart = require('multiparty');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// development only test
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
var testEmail = "jaskobh@hotmail.com";
var testPassword = "123456";
var testuserid = "my_userid";

app.get('/', function (req,res) {
  res.send("BCG REST service");
  });

app.post('/sessions/new/email/:email/password/:password', function (req, res) {
  var email = req.params.email;
  var password = req.params.password;
  if (email == testEmail && password == testPassword) {
    res.json({ userid: "my_userid", token: "token" });
  } else {
    res.json({ userid: "", token: "" });
  }
  
});

app.get('/users/:userid', function (req, res) {
  var userid = req.params.userid;
  if (userid == testuserid ) {
    res.json({ email: testEmail, avatar_url: "avatar_url" });
  } else {
    res.json({ email: "", avatar_url: "" });
  }
});


//upload avatar image
var type = upload.single('image');

app.post('/users/:userid/avatar/:avatar', type,
  function(req, res) {
    var userid = req.params.userid;

    if (userid == testuserid) {
      var tmp_path = req.file.path;
      /** The original name of the uploaded file      stored in the variable "originalname". **/
      var target_path = 'uploads/' + req.file.originalname;
      /** A better way to copy the uploaded file. **/
      var src = fs.createReadStream(tmp_path);
      var dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on('end', function () { res.end('file uploaded'); });
      src.on('error', function (err) { res.end('error'); });

    //  res.json({ avatar_url: "avatar_url" });
    } else {
      res.json({ avatar_url: "" });
    }
  });





//File upload
app.get('/upload', function (req, res) {
  res.render('upload', {
    title: 'Upload Images'
  });
});


app.post('/upload', type, function (req, res, next) {
  /** When using the "single"      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;
  /** The original name of the uploaded file      stored in the variable "originalname". **/
  var target_path = 'uploads/' + req.file.originalname;
  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function () { res.end('file uploaded'); });
  src.on('error', function (err) { res.end('error'); });
  
  //console.log('file info: ', req.file.image);
  ////split the url into an array and then get the last chunk and render it out in the send req.
  //var pathArray = req.file.image.path.split('/');
  //res.send(util.format(' Task Complete \n uploaded %s (%d Kb) to %s as %s'
  //  , req.file.image.name
  //  , req.file.image.size / 1024 | 0
  //  , req.file.image.path
  //  , req.body.title
  //  , req.file.image
  //  , '<img src="uploads/' + pathArray[(pathArray.length - 1)] + '">'
  //));
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
