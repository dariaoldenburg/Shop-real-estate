(function() {
    'use strict';

    angular
        .module('application')
        .service('GoalService', GoalService);

    function GoalService($http) {
        var self = this;

        self.getGoals = function () {
            return $http({
                method: 'GET',
                url: 'api/goals/'
            });
        };

        self.getGoalTypes = function () {
            return $http({
                method: 'GET',
                url: 'api/goalTypes/'
            });
        };

    }
}());