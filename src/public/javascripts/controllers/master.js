/**
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
}]);