var express = require('express');
var router = express.Router();
var data = require('../../data/azure/weight').createWeighInService();
var WeighIn = require('../../domain/weighin');

router.get('/', function(req, res) {
    res.json({message: 'no direct services available'});
});

router.get('/:userId', function(req, res) {
    data.getWeighInsForUser(req.params.userId, function(result) {
        res.json({
            message: 'Weigh Ins for ' + req.params.userId,
            data: result
        });
    });
});

router.put('/:userId', function(req, res) {
    var weighIn = req.body;
    data.insertWeighIn(req.params.userId, weighIn);
    res.json({message: 'Weigh-In Captured'});
});

module.exports = router;
