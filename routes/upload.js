var express = require('express');
var router = express.Router();

var raw = require('../controllers/upload/raw');
var blurred = require('../controllers/upload/blurred');
var highlighted = require('../controllers/upload/highlighted');

router.post('/image/raw/upload', raw.request);
router.post('/image/blurred/upload', blurred.request);
router.post('/image/highlighted/upload', highlighted.request);


module.exports = router;
