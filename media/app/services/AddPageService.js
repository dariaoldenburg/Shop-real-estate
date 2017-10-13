(function() {
    'use strict';

    angular
        .module('application')
        .service('AddPageService', AddPageService);

    function AddPageService() {
        var self = this;

        self.status = {
            addPage: false,
            addPageStep: 1
        };

        self.setStatus = function (status) {
            self.status.addPage = status;
            return self.status.addPage;
        };

        self.setStep = function (step) {
            self.status.addPageStep = step+1;
            return self.status.addPageStep;
        };

    }
}());