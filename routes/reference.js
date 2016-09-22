var express = require('express');
var router = express.Router();

var insert = require('../controllers/reference/add');

router.post('/reference/add', insert.request);

module.exports = router;
