(function() {
    'use strict';

    angular
        .module('application')
        .service('FileUploadService', AuthService);

    function AuthService($http) {
        var self = this;

        self.uploadFile = function (file) {
            var updateData = new FormData();
            updateData.append('file', file);

            return $http({
                method: 'POST',
                data: updateData,
                url: '/api/upload',
                headers: {'Content-Type': undefined }
            });
        };
    }
}());