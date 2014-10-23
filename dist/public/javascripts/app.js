var goldilocksApp = angular.module('goldilocksApp', [
    'ngRoute',
    'ngResource',
    'goldilocksControllers'
]);

goldilocksApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/progress', {
            templateUrl: 'partials/progress.html',
            controller: 'ProgressCtrl'
        })
        .otherwise({
            redirectTo: '/progress'
        });
}]);

var goldilocksControllers = angular.module('goldilocksControllers', []);