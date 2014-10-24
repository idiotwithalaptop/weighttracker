goldilocksApp.service('WeighIns', ['$http', function($http){
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
