goldilocksApp.factory('WeighIns', ['$resource', function($resource){
    return $resource('/api/weighIns', {}, {
        query: {method:'GET', isArray:false}
    });
}]);
