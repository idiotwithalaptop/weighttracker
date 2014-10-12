var express = require('express');
var router = express.Router();
var data = require('../../data/azure/weight').createWeighInService();
var WeighIn = require('../../domain/weighin');

router.get('/', function(req, res) {
    res.json({message: 'no direct services available'});
});

router.get('/:userId', function(req, res) {
    res.json(data.getWeighInsForUser(req.params.userId));
});

router.put('/:userId', function(req, res) {
    var weighIn = new WeighIn(req.body.result, req.body.date);
    data.insertWeighIn(req.params.userId, weighIn);
    res.json({message: 'Weigh-In Captured'});
});

module.exports = router;
