var azure = require('azure-storage');
var tableSvc = azure.createTableService();
var exports = module.exports;

function UserService() {
    tableSvc.createTableIfNotExists('userAuth', function(error, result, response) {
        if(!error) {
            // Table exists or created successfully

        }
    });
}

UserService.prototype.grantViewProfile = function(userId, allowedUserId) {
    var entGen = azure.TableUtilities.entityGenerator;

    var azureWeighIn = {
        PartitionKey: entGen.String(userId),
        RowKey: entGen.String(allowedUserId)
    };

    tableSvc.insertEntity('weight', azureWeighIn, function(error, result, response) {
        if(!error) {

        }
    });
};

UserService.prototype.isAllowedToViewProfile = function(userId, allowedUserId, callback) {
    var query = new azure.TableQuery()
        .select(['result','date'])
        .where('PartitionKey eq ? and RowKey eq ?', userId, allowedUserId);

    tableSvc.queryEntities('userAuth', query, null, function(error, result, response) {
        if(!error) {
            callback({
                error: false,
                result: result.entries.length > 0
            });
        }
        else {
            callback({
                error: true,
                msg: 'Error querying'
            });
        }
    });
};

UserService.prototype.getSharedProfiles = function(userId, callback) {
    var query = new azure.TableQuery()
        .select(['result','date'])
        .where('PartitionKey eq ?', userId);

    tableSvc.queryEntities('userAuth', query, null, function(error, result, response) {
        if(!error) {
            var resultList = [];

            for(var i = 0; i < result.entries.length; i++) {
                var obj = result.entries[i];
                resultList.push(obj.RowKey._);
            }

            callback({
                error: false,
                result: resultList
            });
        }
        else {
            callback({
                error: true,
                msg: 'Error querying'
            });
        }
    });
};

exports.createUserService = function() {
    return new UserService();
};