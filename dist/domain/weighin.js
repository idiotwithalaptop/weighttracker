var date;
var result;

var WeighIn = function(resultIn, dateIn) {
    date = dateIn;
    result = resultIn;
};

WeighIn.prototype = {
    date : date,
    result : result
};

module.exports = WeighIn;