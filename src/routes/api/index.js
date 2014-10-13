var express = require('express');
var router = express.Router();
var weighIns = require('./weighIn');

router.use('/weighIns', weighIns);

/* GET home page. */
router.use(function(req, res, next) {
    if(!req.session.userId) {
        res.redirect('/');
    }
    next();
});


module.exports = router;
