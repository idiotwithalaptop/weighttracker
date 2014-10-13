var express = require('express');
var router = express.Router();
var users = require('./users');
var weighIns = require('./api/weighIn');
var auth = require('./auth');

router.use('/users', users);
router.use('/api/weighIns', weighIns);
router.use('/auth', auth);
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express', csrfToken: req.csrfToken() });
});


module.exports = router;
