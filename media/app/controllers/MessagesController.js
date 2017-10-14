(function() {
  'use strict';

  angular
    .module('application')
    .controller('MessagesController', MessagesController);

  function MessagesController($scope, MessagesService, AuthService) {
    $scope.messages = [];
    MessagesService.fetchAllMessages(AuthService.userID)
      .then(function (response) {
        $scope.messages = response.data.messages;
      });
  }
}());