(function() {
    'use strict';

    angular
        .module('application')
        .controller('EditNotificationController', ['$scope', '$state', 'notification', 'goalsList', 'goalTypesList', '$rootScope', 'NotificationService', EditNotificationController]);

    function EditNotificationController($scope, $state, notification, goalsList, goalTypesList, $rootScope, NotificationService) {
        $scope.statusNotification = 'edit';

        $scope.pageId = notification.page_id;

        $scope.notificationId = notification.id;
        $scope.notificationImage = notification.image || '';
        $scope.name = notification.name;
        $scope.pageUrl = notification.page_url;
        $scope.goalId = notification.goal_id;
        $scope.goalTypeId = notification.goal_type_id;
        $scope.goalVariables = '';
        $.each(goalTypesList, function(key, value){
            if(value.id === $scope.goalTypeId) {
                var variables =value.variables;
                var result = variables.split(", ");
                $scope.goalVariables = result;
            }
        });
        $scope.notificationContent = notification.content;
        $scope.notificationMock = notification.content;
        $scope.step = 1;
        $scope.stepContentTab = 'content';
        $scope.goalsList = goalsList;
        $scope.goalTypesList = goalTypesList;

        $rootScope.$on('updateNotificationImage', function(event, args) {
            $scope.notificationImage = args.image || '';
        });

        $scope.stepComplition = [
            { step: 1, variable: 'name', complete: true, visited: false, message: 'Podaj nazwę powiadomienia' },
            { step: 2, variable: 'pageUrl', complete: true, visited: false },
            { step: 3, variable: 'goalName', complete: true, visited: false, goalType: { complete: false, active: false } },
            { step: 4, variable: 'notificationContent', complete: true, visited: false },
            { step: 4, variable: 'variables', complete: true, visited: false, message: 'Wpisano niedozwolone zmienne w pole treść powiadomienia' },
            { step: 4, variable: 'notificationImage', complete: false, visited: false }
        ];

        if($scope.goalId === 4) {
            $scope.stepComplition[2].goalType.active = true;
            $scope.stepComplition[2].goalType.complete = true;
        }

        $scope.notificationContentVariables = [
            { name: '$first_name$', mock: 'Adam' },
            { name: '$city$', mock: 'Krakowa' },
            { name: '$country$', mock: 'Polski' },
            { name: '$title$', mock: 'Koszulkę' },
            { name: '$title_link$', mock: 'http://example.pl' },
            { name: '$time_ago$', mock: '5 minut temu' },
            { name: '$count$', mock: '10' },
            { name: '$view$', mock: '5' }
        ];


        var variableCount = null;
        if(notification.count_variable !== null) {
          variableCount = '$' + notification.count_variable + '$';
        } else {
          variableCount = '';
        }

        $scope.variablesCount = {
            status: false,
            value: variableCount
        };

        $scope.editNotification = function () {
            var editNotificationData = {
                id: $scope.notificationId,
                name: $scope.name,
                page_url: $scope.pageUrl,
                goal_id: $scope.goalId,
                goal_type_id: $scope.goalTypeId,
                content: $scope.notificationMock,
                count_variable: $scope.variablesCount.value
            };
            if ( $scope.notificationImage !== '' ) {
                editNotificationData.image = $scope.notificationImage;
            }
            NotificationService.editNotification(editNotificationData)
                .then(function(result) {
                    $scope.stepComplition[4].complete = true;
                    $state.go('nav.pageSettings.notifications',{pageId: $scope.pageId});
                }, function(error){
                    if(error.data.type === 'name') {
                      $scope.stepComplition[0].message= error.data.message;
                      $scope.stepComplition[0].complete= false;
                    } else if (error.data.type === 'variables') {
                      $scope.stepComplition[4].message= error.data.message;
                      $scope.stepComplition[4].complete = false;
                    }
                });
        };

        $scope.next = function () {
            event.stopPropagation();
            $scope.stepComplition[$scope.step].visited = true;
            var stepIndex = $scope.step - 1;
            if ( $scope.stepComplition[stepIndex] ) {
                $scope.stepComplition[stepIndex].complete = $scope[$scope.stepComplition[stepIndex].variable] !== '';
                if($scope[$scope.stepComplition[stepIndex].variable] === '') {
                  $scope.stepComplition[stepIndex].message = '';
                }
                if($scope.stepComplition[2].goalType.active && !$scope.stepComplition[2].goalType.complete) {
                    $scope.stepComplition[2].complete = false;
                }
            }
            $scope.stepComplition[stepIndex].visited = true;
            $scope.step= ++$scope.step;
        };

        $scope.chooseGoal = function (event, goal) {
            $scope.goalName = goal.name;
            $scope.goalId = goal.id;
            $scope.goalTypeId = goal.type_id;

            if($scope.goalId === 4) {
                $scope.stepComplition[2].goalType.active = true;
                $scope.stepComplition[2].complete = false;
                $scope.goalVariables = '';
            } else {
                $scope.stepComplition[2].goalType.active = false;
                $scope.stepComplition[2].goalType.complete = false;
                var variables = '';
                goalTypesList.forEach(function(value){
                    if(value.id === goal.type_id) {
                        $scope.goalTypeName = value.name;
                        variables = value.variables;
                    }
                });
                var result = variables.split(", ");
                $scope.goalVariables = result;
            }
        };

        $scope.chooseGoalType = function (event, goalType) {
            $scope.stepComplition[2].complete = true;
            $scope.stepComplition[2].goalType.complete = true;
            $scope.goalName = goalType.name;
            $scope.goalTypeId = goalType.id;
            var variables = goalType.variables;
            var result = variables.split(", ");
            $scope.goalVariables = result;
        };

        $scope.setStep = function (step) {
            if(step === 5) {
                for (var key in $scope.stepComplition) {
                    $scope.stepComplition[key].visited = true;
                }
            }
            var currentStep = $scope.step-1;
            $scope.stepComplition[currentStep].visited = true;
            if ($scope.stepComplition[currentStep]) {
                $scope.stepComplition[currentStep].complete = $scope[$scope.stepComplition[currentStep].variable] !== '';
                if($scope[$scope.stepComplition[currentStep].variable] === '') {
                  $scope.stepComplition[currentStep].message = '';
                }
                if($scope.stepComplition[2].goalType.active && !$scope.stepComplition[2].goalType.complete) {
                    $scope.stepComplition[2].complete = false;
                }
            }
            $scope.step = step;
        };

        $scope.$watch(function () {
            return $scope.notificationMock;
        }, function (mock) {
            var res = mock.match(/\$count\$/g);
            if(res != null) {
                $scope.variablesCount.status = true;
            } else {
                $scope.variablesCount.status = false;
            }
            $scope.notificationContentVariables.forEach(function(variable) {
                mock = mock.split(variable.name).join(variable.mock);
            });
            $scope.notificationContent = mock;
        });

    }
}());