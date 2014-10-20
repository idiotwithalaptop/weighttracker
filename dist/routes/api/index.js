var express = require('express');
var router = express.Router();
var weighIns = require('./weighIn');
var users = require('./users');

router.use('/weighIns', weighIns);
router.use('/users', users);

module.exports = router;
