(function() {
    'use strict';

    angular
        .module('application')
        .controller('NotificationsController', ['$scope', '$stateParams', 'notificationsList', 'NotificationService', NotificationsController]);

    function NotificationsController($scope, $stateParams, notificationsList, NotificationService) {

        $scope.notificationsList = notificationsList;
        $scope.pageId = $stateParams.pageId;

        $scope.setStatus = function (notificationId, status) {
            NotificationService.editNotification({
                id: notificationId,
                active: status
            })
                .then(function(result) {
                });
        };

        $scope.deleteNotification = function (notificationId) {
            NotificationService.deleteNotification(notificationId).then(function(result) {
                for (var i = 0; i < notificationsList.length; i++) {
                    if(notificationsList[i].id == notificationId){
                        notificationsList.splice(i, 1);
                        $scope.notificationsList = notificationsList;
                    }
                }
            });
        };

    }
}());