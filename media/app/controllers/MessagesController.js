(function() {
  'use strict';

  angular
    .module('application')
    .controller('MessagesController', MessagesController);

  function MessagesController($scope, MessagesService, $rootScope) {
    $scope.messages = [];
    MessagesService.fetchAllMessages($rootScope.currentUser.id)
      .then(function (response) {
        $scope.messages = response.data.messages;
      });

    $scope.setSeen = function (id) {
      MessagesService.setSeen(id)
        .then(function () {
          MessagesService.fetchAllMessages($rootScope.currentUser.id)
            .then(function (response) {
              $scope.messages = response.data.messages;
            });
        })
    }
  }
}());