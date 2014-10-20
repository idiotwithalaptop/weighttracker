var express = require('express');
var router = express.Router();
var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var conf = require('../conf');
var userStore = require('../data/azure/users');

/* GET home page. */
router.get('/', function(req, res) {
   res.json({result: 'wacca'});
});

router.post('/login', function(req, res) {
    var oauth2Client = new OAuth2(conf.google.clientId, conf.google.clientSecret, conf.google.redirectUrl);
    oauth2Client.getToken(req.body.authCode, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if(!err) {
            oauth2Client.setCredentials(tokens);

            plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
                if(!err) {
                    req.session.userId = response.id;
                    res.json({profile : response});

                    // Check if user can view their own data
                    var userService = userStore.createUserService();
                    userService.isAllowedToViewProfile(response.id, response.id, function(result) {
                        // if not, enable them
                        if(result.error === false && result.result === true) {
                            userService.grantViewProfile(response.id, response.id);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
