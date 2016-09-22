var express = require('express');
var router = express.Router();

var getAll = require('../controllers/routes/getAll');
var update = require('../controllers/routes/update');

router.get('/routes', getAll.request);
router.post('/routes/update', update.request);

module.exports = router;
