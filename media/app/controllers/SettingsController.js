(function() {
    'use strict';

    angular
        .module('application')
        .controller('SettingsController', SettingsController);

    function SettingsController($scope, $stateParams, SettingService, setting) {
        $scope.pageId = $stateParams.pageId;

        $scope.statusEdit = true;
        $scope.randomDisplay = false;
        $scope.notificationLoop = false;
        $scope.hideMobile = false;
        $scope.randomDelays = false;
        $scope.openNewCard = false;
        $scope.firstDisplay = '';
        $scope.maxDisplays = '';
        $scope.timeDisplay = '';
        $scope.delays = '';
        $scope.ipAddress = '';

        if(setting === null) {
            $scope.statusEdit = false;
        } else {
            $scope.statusEdit = true;
            $scope.randomDisplay = setting.random_display;
            $scope.notificationLoop = setting.notification_loop;
            $scope.hideMobile = setting.hide_mobile;
            $scope.randomDelays = setting.random_delays;
            $scope.openNewCard = setting.open_new_card;
            $scope.firstDisplay = setting.first_display;
            $scope.maxDisplays = setting.max_displays;
            $scope.timeDisplay = setting.time_display;
            $scope.delays = setting.delays;
            $scope.ipAddress = setting.ip_address;
        }

        $scope.addSetting = function () {
            SettingService.addSetting({
                page_id: $scope.pageId,
                random_display: $scope.randomDisplay,
                notification_loop: $scope.notificationLoop,
                hide_mobile: $scope.hideMobile,
                random_delays: $scope.randomDelays,
                open_new_card: $scope.openNewCard,
                first_display: $scope.firstDisplay,
                max_displays: $scope.maxDisplays,
                time_display: $scope.timeDisplay,
                delays: $scope.delays,
                ip_address: $scope.ipAddress
            })
                .then(function(result) {
                });
        };

        $scope.editSetting = function () {
          SettingService.editSetting({
            page_id: $scope.pageId,
            random_display: $scope.randomDisplay,
            notification_loop: $scope.notificationLoop,
            hide_mobile: $scope.hideMobile,
            random_delays: $scope.randomDelays,
            open_new_card: $scope.openNewCard,
            first_display: $scope.firstDisplay,
            max_displays: $scope.maxDisplays,
            time_display: $scope.timeDisplay,
            delays: $scope.delays,
            ip_address: $scope.ipAddress
          })
            .then(function(result) {
            });
        };

    }
}());