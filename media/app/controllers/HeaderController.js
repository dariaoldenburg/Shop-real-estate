(function() {
  'use strict';

  angular
    .module('application')
    .controller('HeaderController', HeaderController);

  function HeaderController($scope, $rootScope, MessagesService) {
    $scope.usersVisible = $rootScope.currentUser.role === 'admin';
    $scope.messages = [];
    $scope.unseen = 0;

    MessagesService.fetchAllMessages($rootScope.currentUser.id)
      .then(function (response) {
        $scope.messages = response.data.messages;
        $scope.unseen = 0;
        $scope.messages.forEach(function(message) {
          if ( message.seen === 0 ) {
            $scope.unseen += 1;
          }
        })
      })
  }
}());