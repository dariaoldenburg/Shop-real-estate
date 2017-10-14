(function() {
  'use strict';

  angular
    .module('application')
    .service('AlertService', AlertService);

  function AlertService(alertify) {
    var self = this;

    self.showMessage = function (response) {
      var msgResponse = '';
      var message = '';
      if(typeof response.validatorError !== 'undefined') {
        msgResponse = response.validatorError;
        Object.keys(msgResponse).forEach(function(key) {
          message = message + msgResponse[key][0] + "</br>";
        });
        alertify
          .maxLogItems(1)
          .error(message);
      } else if (typeof response.error !== 'undefined') {
        msgResponse = response.error;
        alertify
          .maxLogItems(1)
          .error(msgResponse);
      }
    };

    self.messageSuccess = function (response) {
      var msgSuccess = response.success;
      alertify
        .maxLogItems(1)
        .success(msgSuccess);
    };
  }
}());