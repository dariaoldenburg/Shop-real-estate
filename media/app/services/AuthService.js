(function () {
  'use strict';

  angular
    .module('application')
    .service('AuthService', AuthService);

  function AuthService($http) {
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
    }

  }
}());