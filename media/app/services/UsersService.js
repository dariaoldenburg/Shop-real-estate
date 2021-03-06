(function () {
  'use strict';

  angular
    .module('application')
    .service('UsersService', UsersService);

  function UsersService($http) {
    var self = this;

    self.fetchAllUsers = function (id) {
      return $http({
        method: 'GET',
        url: '/api/users/' + id
      });
    };

    self.removeUser = function (id) {
      return $http({
        method: 'DELETE',
        url: '/api/users/' + id
      });
    };

    self.updatePassword = function (id, password, passwordConfirmation) {
      return $http({
        method: 'PUT',
        url: '/api/users/' + id,
        data: {
          password: password,
          password_confirmation: passwordConfirmation
        }
      });
    };

  }
}());