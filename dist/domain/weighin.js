var date;
var result;

function WeighIn(resultIn, dateIn) {
    date = dateIn;
    result = resultIn;
}

WeighIn.prototype = {
    date : date,
    result : result
};