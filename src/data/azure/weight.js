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
        RowKey: entGen.String(Date.now().toISOString()),
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
AzureWeightService.prototype.getWeighInsForUser = function(userId) {
    var query = new azure.TableQuery()
        .where('PartitionKey eq ?', userId);

    var weighins = [];

    tableSvc.queryEntities('weight', query, null, function(error, result, response) {
        if(!error) {
            for(var i = 0; i < result.entries.length; i++) {
                var entry = result.entries[i];
                var weighin = new WeighIn(entry.result, entry.date);
                weighins.push(weighin);
            }
        }
    });

    return weighins;
};

exports.createWeighInService = function() {
    return new AzureWeightService();
};