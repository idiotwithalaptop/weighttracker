var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var csrf = require('csurf');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// store session state in browser cookie
app.use(cookieSession({
    keys: ['iwal1984', 'kyh@$8615']
}));
app.use(csrf());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;
;module.exports = {
    google : {
        clientId : '456375033128-8in1opc1cju7adtqnh6vlgq6cpdoi3pc.apps.googleusercontent.com',
        clientSecret : 'yCEAezYQlJDrifRhG4L6aIs3',
        redirectUrl : 'postmessage'
    }
};;var azure = require('azure-storage');
var tableSvc = azure.createTableService();
var exports = module.exports;

function UserService() {
    tableSvc.createTableIfNotExists('userAuth', function(error, result, response) {
        if(!error) {
            // Table exists or created successfully

        }
    });
}

UserService.prototype.grantViewProfile = function(userId, allowedUserId) {
    var entGen = azure.TableUtilities.entityGenerator;

    var azureWeighIn = {
        PartitionKey: entGen.String(userId),
        RowKey: entGen.String(allowedUserId)
    };

    tableSvc.insertEntity('weight', azureWeighIn, function(error, result, response) {
        if(!error) {

        }
    });
};

UserService.prototype.isAllowedToViewProfile = function(userId, allowedUserId, callback) {
    var query = new azure.TableQuery()
        .select(['result','date'])
        .where('PartitionKey eq ? and RowKey eq ?', userId, allowedUserId);

    tableSvc.queryEntities('userAuth', query, null, function(error, result, response) {
        if(!error) {
            callback({
                error: false,
                result: result.entries.length > 0
            });
        }
        else {
            callback({
                error: true,
                msg: 'Error querying'
            });
        }
    });
};

UserService.prototype.getSharedProfiles = function(userId, callback) {
    var query = new azure.TableQuery()
        .select(['result','date'])
        .where('PartitionKey eq ?', userId);

    tableSvc.queryEntities('userAuth', query, null, function(error, result, response) {
        if(!error) {
            var resultList = [];

            for(var i = 0; i < result.entries.length; i++) {
                var obj = result.entries[i];
                resultList.push(obj.RowKey._);
            }

            callback({
                error: false,
                result: resultList
            });
        }
        else {
            callback({
                error: true,
                msg: 'Error querying'
            });
        }
    });
};

exports.createUserService = function() {
    return new UserService();
};;var azure = require('azure-storage');
var WeighIn = require('../../domain/weighin');
var tableSvc = azure.createTableService();
var exports = module.exports;

function AzureWeightService() {
    tableSvc.createTableIfNotExists('weight', function(error, result, response) {
        if(!error) {
            // Table exists or created successfully

        }
    });
}

/**
 * @param {string} userId                    The User who weighed in
 * @param {WeighIn} weighIn                  The storage access key.
 */
AzureWeightService.prototype.insertWeighIn = function(userId, weighin) {
    var entGen = azure.TableUtilities.entityGenerator;

    var azureWeighIn = {
        PartitionKey: entGen.String(userId),
        RowKey: entGen.String(new Date().toJSON()),
        result: entGen.Double(weighin.result),
        date: entGen.DateTime(weighin.date)
    };

    tableSvc.insertEntity('weight', azureWeighIn, function(error, result, response) {
       if(!error) {

       }
    });
};

/**
 * @param {string} userId                    The User who weighed in
 */
AzureWeightService.prototype.getWeighInsForUser = function(userId, callback) {
    var query = new azure.TableQuery()
        .select(['result','date'])
        .where('PartitionKey eq ?', userId);

    tableSvc.queryEntities('weight', query, null, function(error, result, response) {
        if(!error) {
            var resultList = [];

            for(var i = 0; i < result.entries.length; i++) {
                var obj = result.entries[i];
                resultList.push({result: obj.result._, date: obj.date._});
            }

            callback({
                error: false,
                result: resultList
            });
        }
        else {
            callback({
                error: true,
                msg: 'Error querying'
            });
        }
    });
};

exports.createWeighInService = function() {
    return new AzureWeightService();
};;var date;
var result;

var WeighIn = function(resultIn, dateIn) {
    date = dateIn;
    result = resultIn;
};

WeighIn.prototype = {
    date : date,
    result : result
};

module.exports = WeighIn;;var express = require('express');
var router = express.Router();
var weighIns = require('./weighIn');
var users = require('./users');

router.use('/weighIns', weighIns);
router.use('/users', users);

module.exports = router;
;var express = require('express');
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
;var express = require('express');
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
;var express = require('express');
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
;var express = require('express');
var router = express.Router();
var api = require('./api');
var auth = require('./auth');

router.use('/api', api);
router.use('/auth', auth);

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express', csrfToken: req.csrfToken() });
});

module.exports = router;
