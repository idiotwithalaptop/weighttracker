var express = require('express');
var router = express.Router();
var userData = require('../../data/azure/users');

/* GET users listing. */
router.use('/:userId', function(req, res, next) {
    if (typeof req.session.userId !== 'undefined' && req.session.userId == req.params.userId) {
        next();
    } else {
        req.session.error = 'Access denied!';
        var err = new Error('Access denied!');
        err.status = 401;
        next(err);
    }
});

router.get('/:userId', function(req, res) {
    var userService = userData.createUserService();
    userService.getSharedProfiles(req.params.userId, function(result) {
       res.json(result);
    });
});

module.exports = router;
