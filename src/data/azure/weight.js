var azure = require('azure-storage');
var tableSvc = azure.createTableService();

function AzureWeightService() {
    tableSvc.createTableIfNotExists('weight', function(error, result, response) {
        if(!error) {
            // Table exists or created successfully

        }
    });
}

AzureWeightService.prototype.getWeighInsForUser = function(userName) {

};

module.exports = AzureWeightService;
