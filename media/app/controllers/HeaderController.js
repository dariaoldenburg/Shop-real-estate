(function() {
  'use strict';

  angular
    .module('application')
    .controller('HeaderController', HeaderController);

  function HeaderController($scope, $rootScope) {
    $scope.usersVisible = $rootScope.currentUser.role === 'admin';
  }
}());