(function() {
  'use strict';

  angular
    .module('application')
    .controller('HeaderController', HeaderController);

  function HeaderController($scope, $rootScope, MessagesService, $auth, $state) {
    $scope.usersVisible = $rootScope.currentUser
      ? $rootScope.currentUser.role === 'admin'
      : false;
    $scope.messages = [];
    $scope.unseen = 0;
    $scope.logged = true;

    if($rootScope.currentUser){
      $scope.logged = true;
      MessagesService.fetchAllMessages($rootScope.currentUser.id)
        .then(function (response) {
          $scope.messages = response.data.messages;
          $scope.unseen = 0;
          $scope.messages.forEach(function(message) {
            if ( message.seen === 0 ) {
              $scope.unseen += 1;
            }
          })
        });
    } else {
      $scope.logged = false;
    }


    $scope.logout = function() {
      $auth.logout().then(function() {
        localStorage.removeItem('user');
        $rootScope.authenticated = false;
        $rootScope.currentUser = null;
        $state.go('nav.estates');
      });
    }

  }
}());