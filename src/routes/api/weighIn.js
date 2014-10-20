var express = require('express');
var router = express.Router();
var data = require('../../data/azure/weight').createWeighInService();
var WeighIn = require('../../domain/weighin');

router.use(function(req, res, next) {
    if (typeof req.session.userId !== 'undefined' && req.session.userId) {
        next();
    } else {
        req.session.error = 'Access denied!';
        var err = new Error('Access denied!');
        err.status = 404;
        next(err);
    }
});

router.get('/', function(req, res) {
    data.getWeighInsForUser(req.session.userId, function(result) {
        res.json({
            data: result
        });
    });
});

router.post('/', function(req, res) {
    var weighIn = req.body;
    data.insertWeighIn(req.session.userId, weighIn);
    res.json({message: 'Weigh-In Captured'});
});

module.exports = router;
