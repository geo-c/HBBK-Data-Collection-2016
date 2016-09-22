var db_settings = require('../../server.js').db_settings;
var pg = require('pg');
var multer  =   require('multer');
var fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('userfile');

// GET
exports.request = function(req, res) {
  //var upload = multer({dest: './uploads/'}).single('userfile');
  upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file. " + err);
      }
      image = req.file.destination + '/' + req.file.filename;
      var url = 'http://giv-oct.uni-muenster.de:8083/uploads/' + req.file.filename
      var stats = fs.statSync(image)
      var fileSizeInBytes = stats["size"]
      var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
      res.status(200).send({message:"Image uploaded", highlighted_image_size: fileSizeInMegabytes, url: url});
  });



  var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;
  // Connect to Database
  pg.connect(url, function(err, client, done) {
  });	
};
