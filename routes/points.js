var express = require('express');
var router = express.Router();

var insert = require('../controllers/points/insert');
var getAll = require('../controllers/points/getAll');

router.get('/points', getAll.request);
router.post('/point/insert', insert.request);

module.exports = router;
