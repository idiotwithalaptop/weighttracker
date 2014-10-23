/**
 * Created by rbrown on 23/10/2014.
 */
goldilocksControllers.controller('ProgressCtrl', ['$scope', '$http', 'WeighIns', function ($scope, $http, WeighIns) {
    $scope.progress = WeighIns.query();
}]);