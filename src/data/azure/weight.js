var azure = require('azure-storage');
var WeighIn = require('../../domain/weighin');
var tableSvc = azure.createTableService();
var exports = module.exports;

function AzureWeightService() {
    tableSvc.createTableIfNotExists('weight', function(error, result, response) {
        if(!error) {
            // Table exists or created successfully

        }
    });
}

/**
 * @param {string} userId                    The User who weighed in
 * @param {WeighIn} weighIn                  The storage access key.
 */
AzureWeightService.prototype.insertWeighIn = function(userId, weighin) {
    var entGen = azure.TableUtilities.entityGenerator;

    var azureWeighIn = {
        PartitionKey: entGen.String(userId),
        RowKey: entGen.String(new Date().toJSON()),
        result: entGen.Double(weighin.result),
        date: entGen.DateTime(weighin.date)
    };

    tableSvc.insertEntity('weight', azureWeighIn, function(error, result, response) {
       if(!error) {

       }
    });
};

/**
 * @param {string} userId                    The User who weighed in
 */
AzureWeightService.prototype.getWeighInsForUser = function(userId, callback) {
    var query = new azure.TableQuery()
        .select(['result','date'])
        .where('PartitionKey eq ?', userId);

    tableSvc.queryEntities('weight', query, null, function(error, result, response) {
        if(!error) {
            callback({
                error: false,
                result: result.entries
            });
        }
        else {
            callback({
                error: true,
                result: result,
                msg: 'Error querying'
            });
        }
    });
};

exports.createWeighInService = function() {
    return new AzureWeightService();
};