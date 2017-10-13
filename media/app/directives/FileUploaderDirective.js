(function () {
    'use strict';

    angular
        .module('application')
        .directive("fileUploader", [ '$rootScope', 'FileUploadService', function ($rootScope, FileUploadService) {
        return {
            scope: false,
            link: function (scope, element) {
                element.bind('change', function (evt) {
                    scope.$apply(function () {
                        if ( evt.target.files.length === 0 ) {
                            return;
                        }
                        FileUploadService.uploadFile(evt.target.files[0])
                            .then(function (response) {
                                response = response.data;
                                if ( response.success ) {
                                    $rootScope.$broadcast('updateNotificationImage', {
                                        image: response.url
                                    });
                                }
                            });
                    });
                });
            }
        }
    } ]);
})();
