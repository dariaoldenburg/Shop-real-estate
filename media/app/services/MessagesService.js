(function() {
  'use strict';

  angular
    .module('application')
    .service('MessagesService', MessagesService);

  function MessagesService($http) {
    var self = this;

    self.fetchAllMessages = function (id) {
      return $http({
        method: 'GET',
        url: '/api/messages/' + id
      });
    };

    self.setSeen = function (id) {
      return $http({
        method: 'PUT',
        url: '/api/messages/' + id
      });
    }
  }
}());