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

app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

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

module.exports = WeighIn;;var goldilocksApp = angular.module('goldilocksApp', [
    'ngRoute',
    'ngResource',
    'highcharts-ng',
    'ui.bootstrap',
    'goldilocksControllers'
]);

goldilocksApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html'
        })
        .when('/progress', {
            templateUrl: 'partials/progress.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

var goldilocksControllers = angular.module('goldilocksControllers', []);;/**
 * Created by rbrown on 23/10/2014.
 */
goldilocksControllers.controller('HomeCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        $http.post('/auth/login', {authCode: authResult.code})
            .success(function(result) {
                if (result.profile) {
                    $scope.$emit('login:success', {fullName: result.profile.displayName, avatarUrl: result.profile.image.url});
                } else {
                    $scope.$emit('login:fail');
                }
            })
            .error(function() {
                $scope.$emit('login:error');
            });
    };

    // Render the sign in button.
    $scope.renderSignInButton = function() {
        if(typeof gapi !== 'undefined') {
            // Additional params
            var additionalParams = {
                'callback': $scope.signInCallback // Function handling the callback.
            };

            gapi.signin.render('signInButton', additionalParams);
        }
        $timeout($scope.renderSignInButton, 500);
    };

    // Start function in this example only renders the sign in button.
    $scope.start = function() {
        $scope.renderSignInButton();
    };

    // Call start function on load.
    $scope.start();
}]);
/*
 function signInCallback(authResult) {
 if (authResult['code']) {

 // Hide the sign-in button now that the user is authorized, for example:
 $('#signinButton').attr('style', 'display: none');

 // Send the code to the server
 $.ajax({
 type: 'POST',
 contentType: 'application/json; charset=utf-8',
 url: 'auth/login',
 success: function (result) {
 // Handle or verify the server response if necessary.

 // Prints the list of people that the user has allowed the app to know
 // to the console.
 console.log(result);
 if (result['profile']) {
 $('#results').html('Hello ' + result['profile']['displayName'] + '. You successfully made a server side call to people.get and people.list');
 } else {
 $('#results').html('Failed to make a server-side call. Check your configuration and console.');
 }
 },
 processData: false,
 dataType: 'json',
 data: JSON.stringify({_csrf: '<%= csrfToken %>', authCode: authResult['code'] })
 });
 } else if (authResult['error']) {
 // There was an error.
 // Possible error codes:
 //   "access_denied" - User denied access to your app
 //   "immediate_failed" - Could not automatially log in the user
 // console.log('There was an error: ' + authResult['error']);
 }
 }
 */

;/**
 * Created by rbrown on 23/10/2014.
 */
goldilocksControllers.controller('MasterCtrl', ['$scope', '$location', '$log', function ($scope, $location, $log) {
    $scope.username = null;
    $scope.avatar = null;
    $scope.loginStatus = null;

    $scope.$on('login:success', function(event, result) {
        $scope.username = result.fullName;
        $scope.avatar = result.avatarUrl;
        $log.debug('Login Successful');
        $location.path('/progress');
    });
    $scope.$on('login:fail', function(event, result) {
        $scope.loginStatus = 'failed';
        $log.debug('Login Failed');
    });
    $scope.$on('login:error', function(event, result) {
        $scope.loginStatus = 'Login Error';
        $log.debug('Login Error');
    });
}]);;/**
 * Created by rbrown on 23/10/2014.
 */
goldilocksControllers.controller('ProgressCtrl', ['$scope', '$modal', '$timeout', 'WeighIns', function ($scope, $modal, $timeout, WeighIns) {
    $scope.progress = null;
    $scope.opened = true;
    $scope.dt = new Date();
    $scope.minWeight = null;

    $scope.update = function() {
        $.snackbar({content: "Loading your progress..."});
        WeighIns.getWeighIns(null, $scope.onSuccess, $scope.onFail);
    };

    $scope.onSuccess = function(data) {
        $.snackbar({content: "Done"});
        $scope.progress = data.data;
        var array = [];
        for(var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            var weight = parseFloat(item.result);
            array.push([Date.parse(item.date), weight]);
            if($scope.minWeight === null || weight < $scope.minWeight) {
                $scope.minWeight = weight;
            }
        }

        $scope.chartConfig.series = [{
            name: 'Weight History',
            data: array
        }];

        $scope.chartConfig.yAxis.min = $scope.minWeight;
    };

    $scope.onFail = function(data) {
        $.snackbar({content: "Progress Loading failed"});
        $scope.status = 'Fail';
    };

    $scope.start = function() {
        $scope.update();
    };

    $scope.start();

    $scope.chartConfig = {
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            },
            min: 0
        },

        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b><br/>',
            valueSuffix: ' cm',
            shared: true
        }


    };

    $scope.openAddModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'addModal.html',
            controller: 'AddModalCtrl'
        });

        modalInstance.result.then(function (result) {
            $.snackbar({content: "Saving ..."});
            WeighIns.saveWeighIn(result, $scope.saveSuccess, $scope.saveError);
        }, function () {
        });
    };

    $scope.saveSuccess = function() {
        $.snackbar({content: "Done."});
        $timeout($scope.update, 2000);
    };

    $scope.saveError = function() {
        $.snackbar({content: "Error saving."});
    };
}]);


goldilocksControllers.controller('AddModalCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.today = new Date();
    $scope.dt = $scope.today;
    $scope.weight = null;

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        showWeeks: false,
        maxDate: $scope.today
    };

    $scope.format = 'dd/MM/yyyy';

    $scope.submit = function () {
        $modalInstance.close({result: $scope.weight, date: $scope.dt.toISOString()});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
;goldilocksApp.service('WeighIns', ['$http', function($http){
    this.getWeighIns = function(userId, successCallback, errorCallback) {
        var url = '/api/weighIns';
        if(typeof userId !== 'undefined' && userId) {
            url += '/' + userId;
        }
        $http.get(url)
            .success(successCallback)
            .error(errorCallback);
    };

    this.saveWeighIn = function(weighInObj, successCallback, errorCallback) {
        var url = '/api/weighIns';
        $http.post(url, weighInObj)
            .success(successCallback)
            .error(errorCallback);
    };
}]);
;var express = require('express');
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
            data: result.result.sort(function(a, b) {
                return a.date.getTime() - b.date.getTime();
            })
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
