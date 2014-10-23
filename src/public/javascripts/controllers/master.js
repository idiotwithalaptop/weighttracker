/**
 * Created by rbrown on 23/10/2014.
 */
goldilocksControllers.controller('MasterCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    $scope.username = null;
    $scope.avatar = null;

    // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        $http.post('/auth/login', {authCode: authResult['code']})
            .success(function(result) {
                if (result['profile']) {
                    $scope.username = result['profile']['displayName'];
                    $scope.avatar = result.profile.image.url;
                } else {
                }
            })
            .error(function() {
            });
        /*$.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            url: 'auth/login',
            success: function (result) {
                // Handle or verify the server response if necessary.

                // Prints the list of people that the user has allowed the app to know
                // to the console.
                console.log(result);
                $scope.apply(function() {
                    if (result['profile']) {
                       $scope.username = result['profile']['displayName'];
                    } else {
                        $scope.username = 'Authentication Failed';
                    }
                });

            },
            processData: false,
            dataType: 'json',
            data: JSON.stringify({_csrf: '<%= csrfToken %>', authCode: authResult['code'] })
        });*/
    };

    // Render the sign in button.
    $scope.renderSignInButton = function() {
        if(typeof gapi !== 'undefined') {
            // Additional params
            var additionalParams = {
                'callback': $scope.signInCallback // Function handling the callback.
            };

            gapi.signin.render('signInButton', additionalParams);
        }
        $timeout($scope.renderSignInButton, 500);
    }

    // Start function in this example only renders the sign in button.
    $scope.start = function() {
        $scope.renderSignInButton();
    };

    // Call start function on load.
    $scope.start();
}]);
/*
function signInCallback(authResult) {
    if (authResult['code']) {

        // Hide the sign-in button now that the user is authorized, for example:
        $('#signinButton').attr('style', 'display: none');

        // Send the code to the server
        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            url: 'auth/login',
            success: function (result) {
                // Handle or verify the server response if necessary.

                // Prints the list of people that the user has allowed the app to know
                // to the console.
                console.log(result);
                if (result['profile']) {
                    $('#results').html('Hello ' + result['profile']['displayName'] + '. You successfully made a server side call to people.get and people.list');
                } else {
                    $('#results').html('Failed to make a server-side call. Check your configuration and console.');
                }
            },
            processData: false,
            dataType: 'json',
            data: JSON.stringify({_csrf: '<%= csrfToken %>', authCode: authResult['code'] })
        });
    } else if (authResult['error']) {
        // There was an error.
        // Possible error codes:
        //   "access_denied" - User denied access to your app
        //   "immediate_failed" - Could not automatially log in the user
        // console.log('There was an error: ' + authResult['error']);
    }
}
*/
