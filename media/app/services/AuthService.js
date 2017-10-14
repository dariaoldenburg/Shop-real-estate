(function () {
  'use strict';

  angular
    .module('application')
    .service('AuthService', AuthService);

  function AuthService($http) {
    var self = this;
    self.userID = 3;

    self.remindPassword = function (email) {
      return $http({
        method: 'POST',
        url: 'api/password/email',
        data: {
          email: email
        }
      });
    };

    self.resetPassword = function (credentials) {
      return $http({
        method: 'POST',
        url: 'api/password/reset',
        data: credentials
      });
    };

    self.settingsAccount = function (data) {
      return $http({
        method: 'POST',
        url: 'api/user/settingsAccount',
        data: data
      });
    };

  }
}());