/**
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
