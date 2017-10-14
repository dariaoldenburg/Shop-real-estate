(function () {
  'use strict';

  angular
    .module('application')
    .service('UsersService', UsersService);

  function UsersService($http) {
    var self = this;

    self.fetchAllUsers = function () {
      return $http({
        method: 'GET',
        url: '/api/users'
      });
    };

    self.removeUser = function (id) {
      return $http({
        method: 'DELETE',
        url: '/api/users/' + id
      });
    };

    self.updatePassword = function (id, password) {
      return $http({
        method: 'PUT',
        url: '/api/users/' + id,
        data: {
          password: password
        }
      });
    };

  }
}());