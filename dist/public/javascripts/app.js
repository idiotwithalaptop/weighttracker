var goldilocksApp = angular.module('goldilocksApp', [
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

var goldilocksControllers = angular.module('goldilocksControllers', []);