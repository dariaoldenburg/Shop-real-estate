(function() {
    'use strict';

    angular
        .module('application')
        .controller('AuthenticationController', AuthenticationController);

    function AuthenticationController($scope, $state, $auth, $http, $rootScope, $window, MessagesService) {
        $scope.email = '';
        $scope.password = '';
        $scope.loginError = false;
        $scope.loginErrorText = '';

        $scope.login = function () {
            var credentials = {
                email: $scope.email,
                password: $scope.password
            };

            $auth.login(credentials).then(function(data){
                return $http.get('api/authenticate/user');
            }, function(error){
                if(error.status === 401){
                    var loginErrorText = 'Podano niewłaściwy mail lub hasło';
                    // $scope.loginError = true;
                    // $scope.loginErrorText = 'Podano niewłaściwy mail lub hasło';
                    MessagesService.showMessage('message', loginErrorText);
                }
            }).then(function(response){
                var user = JSON.stringify(response.data.user);
                $window.localStorage.setItem('user', user);
                $rootScope.authenticated = true;
                $rootScope.currentUser = response.data.user;
                if($window.localStorage.getItem('showWelcome')) {
                    $window.localStorage.removeItem('showWelcome');
                    $state.go('nav.welcome');
                } else {
                    $state.go('nav.main');
                }
            });

        }

    }
}());