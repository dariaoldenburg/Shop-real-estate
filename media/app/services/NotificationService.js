(function() {
    'use strict';

    angular
        .module('application')
        .service('NotificationService', NotificationService);

    function NotificationService($http) {
        var self = this;

        self.addNotification = function (notification) {
            return $http({
                method: 'POST',
                url: 'api/notifications',
                data: notification
            });
        };

        self.editNotification = function (notification) {
            return $http({
                method: 'PUT',
                url: 'api/notifications/'+notification.id,
                data: notification
            });
        };

        self.getNotifications = function (pageId) {
            return $http({
                method: 'GET',
                url: 'api/notifications/'+pageId
            });
        };

        self.getNotificationById = function (id) {
            return $http({
                method: 'GET',
                url: 'api/notification/'+id
            });
        };

        self.deleteNotification = function (notificationId) {
            return $http({
                method: 'DELETE',
                url: 'api/notifications/'+notificationId
            });
        };

    }
}());