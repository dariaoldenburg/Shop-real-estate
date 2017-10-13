(function() {
    'use strict';

    angular
        .module('application')
        .service('SettingService', SettingService);

    function SettingService($http) {
        var self = this;

        self.getSettingByPageId = function (id) {
            return $http({
                method: 'GET',
                url: 'api/settings/'+id
            });
        };

        self.addSetting = function (setting) {
            return $http({
                method: 'POST',
                url: 'api/settings/',
                data: setting
            });
        };

        self.editSetting = function (setting) {
            return $http({
                method: 'PUT',
                url: 'api/settings/'+setting.page_id,
                data: setting
            });
        };

    }
}());