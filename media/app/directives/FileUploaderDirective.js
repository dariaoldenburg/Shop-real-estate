(function () {
  'use strict';

  angular
    .module('application')
    .directive("fileUploader", ['$rootScope', 'EstatesService', function ($rootScope, EstatesService) {
      return {
        scope: false,
        link: function (scope, element) {
          element.bind('change', function (evt) {
            scope.$apply(function () {
              if (evt.target.files.length === 0) {
                return;
              }
              EstatesService.sendPhoto(evt.target.files[0])
                .then(function (response) {
                  response = response.data;
                  if (response.success) {
                    EstatesService.loadCurrentPhoto(response.url);
                    $rootScope.$broadcast(EstatesService.status.PHOTO_UPLOADED);
                  }
                });
            });
          });
        }
      }
    }]);
})();