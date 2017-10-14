(function () {
  'use strict';

  angular
    .module('application')
    .service('AuthService', AuthService);

  function AuthService($http, $auth, $window, $rootScope, $state) {
    var self = this;
    self.userID = 3;

    self.register = function (email, number, password) {
      return $http({
        method: 'POST',
        url: '/api/register',
        data: {
          email: email,
          telephone: number,
          password: password,
          password_confirmation: password
        }
      });
    };

    self.login = function (email, password) {
      var credentials = {
        email: email,
        password: password
      };

      $auth.login(credentials).then(function() {
        return $http.get('api/authenticate/user');
      }, function(error) {
        if( error.status === 401 ) {
          var loginErrorText = 'Podano niewłaściwy mail lub hasło';
          MessagesService.showMessage('message', loginErrorText);
        }
      }).then(function(response) {
        var user = JSON.stringify(response.data.user);
        $window.localStorage.setItem('user', user);
        $rootScope.authenticated = true;
        $rootScope.currentUser = response.data.user;
        $state.go('estates');
      });

    }

  }
}());