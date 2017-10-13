(function() {
    'use strict';

    angular
        .module('application')
        .service('RegisterService', RegisterService);

    function RegisterService($http) {
        var self = this;

        self.step1data = {};
        self.message = {
            status: '',
            message: ''
        };

        self.registerStepOne = function (email) {
            self.step1data = {
                email: email
            };
            return $http({
                method: 'POST',
                url: 'api/user/signup/part/first',
                data: {
                    email: email
                }
            });
        };

        self.registerStepSecond = function (data) {
            data.email = self.step1data.email;
            return $http({
                method: 'POST',
                url: 'api/user/signup/part/second',
                data: data
            });
        };

        self.registerConfirmation = function (token) {
            return $http({
                method: 'POST',
                url: '/api/user/confirmation/'+token,
            });
        };

        self.registerStepThird = function (data) {
            return $http({
                method: 'POST',
                url: 'api/user/signup/part/third',
                data: data
            });
        };


    }
}());