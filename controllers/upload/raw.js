var db_settings = require('../../server.js').db_settings;
var pg = require('pg');
var multer  =   require('multer');
var ExifImage = require('exif').ExifImage;
var fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

function ConvertDMSToDD(dg, direction) {
    try {
      var dd = dg[0] + dg[1]/60 + dg[2]/(60*60);
      if (direction == "S" || direction == "W") {
          dd = dd * -1;
      } // Don't do anything for N or E
      return dd;
    } catch (err) {
      return "";
    }
}

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
      try {
        new ExifImage({ image :  image}, function (error, exifData) {
          if (error) {
            console.log('Error: '+error.message);
            res.send(error);
          } else {
            dt = {
              url: url,
              latitude: ConvertDMSToDD(exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef),
              longitude: ConvertDMSToDD(exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef),
              device: exifData.image.Make + ' ' + exifData.image.Model,
              data_captured: exifData.exif.CreateDate,
              raw_image_size: fileSizeInMegabytes
            }
            res.send(dt);
          }
        });
      } catch (error) {
        console.log('Error: ' + error.message);
      }
  });



  var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;
  // Connect to Database
  pg.connect(url, function(err, client, done) {
  });	
};
