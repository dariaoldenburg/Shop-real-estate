angular.module("uiSwitch",[]).directive("switch",function(){return{restrict:"AE",replace:!0,transclude:!0,template:function(n,e){var s="";return s+="<span",s+=' class="switch'+(e.class?" "+e.class:"")+'"',s+=e.ngModel?' ng-click="'+e.disabled+" ? "+e.ngModel+" : "+e.ngModel+"=!"+e.ngModel+(e.ngChange?"; "+e.ngChange+'()"':'"'):"",s+=' ng-class="{ checked:'+e.ngModel+", disabled:"+e.disabled+' }"',s+=">",s+="<small></small>",s+='<input type="checkbox"',s+=e.id?' id="'+e.id+'"':"",s+=e.name?' name="'+e.name+'"':"",s+=e.ngModel?' ng-model="'+e.ngModel+'"':"",s+=' style="display:none" />',s+='<span class="switch-text">',s+=e.on?'<span class="on">'+e.on+"</span>":"",s+=e.off?'<span class="off">'+e.off+"</span>":" ",s+="</span>"}}});
angular.module("application", ['ui.router', 'satellizer', 'ngAlertify', 'uiSwitch'])
    .config([
        '$interpolateProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$authProvider',
        '$httpProvider',
        function (
            $interpolateProvider,
            $stateProvider,
            $urlRouterProvider,
            $authProvider,
            $httpProvider
        ) {

            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');

            function checkAuth($state, $window, $rootScope) {
                var token = $window.localStorage.getItem('satellizer_token');
                var loginState= $window.location.origin+'/#!/login';
                var mainState= $window.location.origin+'/#!/';
                var remindPasswordState= $window.location.origin+'/#!/remindPassword';
                var resetPasswordState= $window.location.origin+'/#!/resetPassword';
                var regexResetPasswordState = (resetPasswordState.replace(/\//g, "\\/"))+'/.+';
                var regexResetPassword = new RegExp(regexResetPasswordState,"g");
                var regex = /\/#!\/register\/third\/.+/g;
                var currentState = $window.location.href;
                var user = $window.localStorage.getItem('user');
                if ((!token || !user) && (currentState != mainState) && (currentState != remindPasswordState) && (!currentState.match(regexResetPassword)) && (!currentState.match(regex))) {
                    $window.localStorage.removeItem('user');
                    $rootScope.authenticated = false;
                    $state.go('nav.login');
                } else if(token && user && (currentState === loginState || currentState === mainState)){
                    $state.go('nav.main');
                } else if(user && (currentState === mainState || currentState === remindPasswordState) && !token) {
                  $window.localStorage.removeItem('user');
                  $rootScope.authenticated = false;
                }
                return true;
            }

            $authProvider.loginUrl = '/api/authenticate';

            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('register',{
                    name: 'register',
                    controller: 'RegisterController',
                    url: '/register',
                    templateUrl: 'views/register.html'
                })
              .state('login',{
                name: 'login',
                controller: 'LoginController',
                url: '/login',
                templateUrl: 'views/login.html'
              })
              .state('add-estate',{
                name: 'addEstate',
                controller: 'addEstateController',
                url: '/add-estate',
                templateUrl: 'views/addEstate.html'
              })
              .state('edit-estate',{
                name: 'editEstate',
                controller: 'editEstateController',
                url: '/edit-estate',
                templateUrl: 'views/editEstate.html'
              })
              .state('estates',{
                name: 'estates',
                controller: 'EstatesController',
                url: '/estates',
                templateUrl: 'views/estates.html'
              })
              .state('messages',{
                name: 'messages',
                controller: 'MessagesController',
                url: '/messages',
                templateUrl: 'views/messages.html'
              })
              .state('users',{
                name: 'users',
                controller: 'UsersController',
                url: '/users',
                templateUrl: 'views/users.html'
              })
              .state('report',{
                name: 'report',
                controller: 'ReportController',
                url: '/report',
                templateUrl: 'views/report.html'
              });

            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common["X-Requeste    d-With"];
            $httpProvider.defaults.headers.common["Accept"] = "application/json";
            $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
            $httpProvider.interceptors.push(['$q', 'MessagesService', 'alertify', '$rootScope', '$state', function ($q, MessagesService, alertify, $rootScope, $state) {
                return {
                    'responseError': function (response) {
                        if(response.status === 400) {
                            if(response.data.error == 'token_not_provided'){
                                // $auth.logout().then(function () {
                                    localStorage.removeItem('satellizer_token');
                                    localStorage.removeItem('user');
                                    $rootScope.authenticated = false;
                                    $rootScope.currentUser = null;
                                    response.data.error = 'Zaloguj się ponownie';
                                    $state.go('nav.login');
                                // });

                                // AuthService.logout();
                                // $http.defaults.headers.common.Authorization = '';
                                // $state.go('nav.login');
                            }
                            MessagesService.showMessage(response.data);
                        }
                        if(response.status === 401) {
                            if(response.data.error == 'invalid_credentials'){
                                var msg = {
                                    error: 'Podano błędny email lub hasło'
                                };
                                MessagesService.showMessage(msg);
                                $state.go('nav.login');
                            }
                            console.error("Brak autoryzacji");
                            $state.go('nav.login');
                        }

                        return $q.reject(response);
                    },

                    response: function (response) {
                        if(response.status === 200 && typeof response.data.success !== 'undefined') {
                            MessagesService.messageSuccess(response.data);
                        }
                        return response;
                    }


                };
            }]);


        }
    ]);
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

(function() {
    'use strict';

    angular
        .module('application')
        .controller('AddDetailsController', AddDetailsController);

    function AddDetailsController($scope, $state, PageService, AddPageService, $rootScope) {
        $scope.status = false;

        $scope.addPage = AddPageService.status.addPage;
        $scope.addPageStep = 1;
        $rootScope.$broadcast('addPageStep', {
            addPageStep: $scope.addPageStep
        });

        $scope.prooflyBranding = 1;

        $scope.addPage = function () {
            PageService.addPage({
                name: $scope.namePage,
                url: $scope.url,
                utm_source: $scope.utmSource,
                utm_medium: $scope.utmMedium,
                proofly_branding: $scope.prooflyBranding,
                verification: $scope.verification
            })
                .then(function(result) {
                    AddPageService.setStep($scope.addPageStep);
                    $rootScope.$broadcast('addPageStep', {
                        addPageStep: AddPageService.status.addPageStep
                    });
                    $state.go('nav.addPage.installation', {
                        pageId: result.data.page.id
                    });
                });
        };

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('AddNotificationController', ['$scope', '$rootScope','$state', '$stateParams', 'goalsList', 'goalTypesList', 'NotificationService', 'AddPageService', AddNotificationController]);

    function AddNotificationController($scope, $rootScope, $state, $stateParams,goalsList, goalTypesList, NotificationService, AddPageService) {
        $scope.statusNotification = 'add';

        $scope.addPage = AddPageService.status.addPage;
        $scope.addPageStep = 3;
        $rootScope.$broadcast('addPageStep', {
            addPageStep: $scope.addPageStep
        });

        $scope.name = '';
        $scope.goalId = null;
        $scope.goalTypeId = null;
        $scope.goalName = '';
        $scope.pageUrl = '';
        $scope.notificationContent = '';
        $scope.notificationMock = '';
        $scope.step = 1;
        $scope.stepContentTab = 'content';
        $scope.notificationImage = '';
        $scope.goalsList = goalsList;
        $scope.goalTypesList = goalTypesList;
        $scope.pageId = $stateParams.pageId;

        $rootScope.$on('updateNotificationImage', function(event, args) {
            $scope.notificationImage = args.image || '';
        });

        $scope.stepComplition = [
            { step: 1, variable: 'name', complete: false, visited: false, message: 'Podaj nazwę powiadomienia' },
            { step: 2, variable: 'pageUrl', complete: false, visited: false },
            { step: 3, variable: 'goalName', complete: false, visited: false, goalType: { complete: false, active: false } },
            { step: 4, variable: 'notificationContent', complete: false, visited: false },
            { step: 4, variable: 'variables', complete: true, visited: false, message: 'Wpisano niedozwolone zmienne w pole treść powiadomienia' },
            { step: 4, variable: 'notificationImage', complete: false, visited: false }
        ];

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

        $scope.variablesCount = {
            status: false,
            value: null
        };

        $scope.addNotification = function () {
            var addNotificationData = {
                page_id: $scope.pageId,
                name: $scope.name,
                page_url: $scope.pageUrl,
                goal_id: $scope.goalId,
                goal_type_id: $scope.goalTypeId,
                content: $scope.notificationMock,
                count_variable: $scope.variablesCount.value
            };
            if ( $scope.notificationImage !== '' ) {
                addNotificationData.image = $scope.notificationImage;
            }
            NotificationService.addNotification(addNotificationData)
                .then(function(result) {
                    AddPageService.status.addPage = false;
                    $scope.stepComplition[4].complete = true;
                    $state.go('nav.pageSettings.notifications',{pageId: $scope.pageId});
                },function(error){
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
(function() {
    'use strict';

    angular
        .module('application')
        .controller('AddPageController', AddPageController);

    function AddPageController($scope, $state, AddPageService, PageService, pagesList) {
        $scope.status = false;

        $scope.addPage = AddPageService.setStatus(true);
        $scope.addPageStep = AddPageService.status.addPageStep;
        $scope.pagesList = pagesList;

        $scope.$on('addPageStep', function(event, args) {
            $scope.addPageStep = args.addPageStep;
            console.log($scope.addPageStep);
        });

        $scope.$on('pagesListUpdated', function(event, args) {
            $scope.pagesList = args.pagesList;
        });

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('AppController', AppController);

    function AppController($window, $rootScope) {

        if ($window.localStorage.getItem('user')) {
            var user = $window.localStorage.getItem('user');
            $rootScope.authenticated = true;
            $rootScope.currentUser = JSON.parse(user);
        }
    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('AuthenticationController', AuthenticationController);

    function AuthenticationController($scope, $state, $auth, $http, $rootScope, $window, MessagesService) {
        $scope.email = '';
        $scope.password = '';
        $scope.loginError = false;
        $scope.loginErrorText = '';

        $scope.login = function () {
            var credentials = {
                email: $scope.email,
                password: $scope.password
            };

            $auth.login(credentials).then(function(data){
                return $http.get('api/authenticate/user');
            }, function(error){
                if(error.status === 401){
                    var loginErrorText = 'Podano niewłaściwy mail lub hasło';
                    // $scope.loginError = true;
                    // $scope.loginErrorText = 'Podano niewłaściwy mail lub hasło';
                    MessagesService.showMessage('message', loginErrorText);
                }
            }).then(function(response){
                var user = JSON.stringify(response.data.user);
                $window.localStorage.setItem('user', user);
                $rootScope.authenticated = true;
                $rootScope.currentUser = response.data.user;
                if($window.localStorage.getItem('showWelcome')) {
                    $window.localStorage.removeItem('showWelcome');
                    $state.go('nav.welcome');
                } else {
                    $state.go('nav.main');
                }
            });

        }

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('DetailsController', DetailsController);

    function DetailsController($scope, $state, page, PageService, $rootScope) {
        $scope.pageId = page.id;
        $scope.namePage = page.name;
        $scope.url = page.url;
        $scope.utmSource = page.utm_source;
        $scope.utmMedium = page.utm_medium;
        $scope.status = page.status;
        $scope.prooflyBranding = page.proofly_branding;
        $scope.verification = page.verification;

        $scope.editPage = function () {
            PageService.editPage({
                id: $scope.pageId,
                name: $scope.namePage,
                url: $scope.url,
                utm_source: $scope.utmSource,
                utm_medium: $scope.utmMedium,
                status: $scope.status,
                proofly_branding: $scope.prooflyBranding,
                verification: $scope.verification
            })
                .then(function(result) {
                    PageService.showPage(result.data.page.  user_id).then(function(response){
                        $rootScope.$broadcast('pagesListUpdated', { pagesList: response.data.pages });
                        $state.go('nav.main');
                    });
                });
        };
    }
}());
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
(function() {
    'use strict';

    angular
        .module('application')
        .controller('InstallationController', InstallationController);

    function InstallationController($scope, $stateParams, page, AddPageService, $state, $rootScope) {
        $scope.pageId = $stateParams.pageId;
        $scope.pageApi = page.api_key;

        $scope.addPage = AddPageService.status.addPage;
        $scope.addPageStep = 2;
        $rootScope.$broadcast('addPageStep', {
            addPageStep: $scope.addPageStep
        });


        $scope.next = function () {
            AddPageService.setStep($scope.addPageStep);
            $rootScope.$broadcast('addPageStep', {
                addPageStep: AddPageService.status.addPageStep
            });
            AddPageService.status.addPage = true;
            $state.go('nav.addPage.notification', {
                pageId: $scope.pageId
            });
        };

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('MainController', ['$scope', 'pagesList', 'PageService', '$rootScope', MainController]);

    function MainController($scope, pagesList, PageService, $rootScope) {

        $scope.pagesList = pagesList;

        $scope.setStatus = function (pageId, status) {
            PageService.editPage({
                id: pageId,
                status: status
            })
                .then(function(result) {
                });
        };

        $scope.deletePage = function (pageId) {
            PageService.deletePage(pageId).then(function(result) {
                for (var i = 0; i < pagesList.length; i++) {
                    if(pagesList[i].id == pageId){
                        pagesList.splice(i, 1);
                        $scope.pagesList = pagesList;
                    }
                }
                $rootScope.$broadcast('pagesListUpdated', { pagesList: $scope.pagesList });
            });
        };

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('NavController', ['$scope', NavController]);

    function NavController($scope) {


        //zaimportuj pagesList
        // $scope.pagesList = pagesList;

        // $scope.$on('pagesListUpdated', function(event, args) {
        //     $scope.pagesList = args.pagesList;
        // });

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('NotificationsController', ['$scope', '$stateParams', 'notificationsList', 'NotificationService', NotificationsController]);

    function NotificationsController($scope, $stateParams, notificationsList, NotificationService) {

        $scope.notificationsList = notificationsList;
        $scope.pageId = $stateParams.pageId;

        $scope.setStatus = function (notificationId, status) {
            NotificationService.editNotification({
                id: notificationId,
                active: status
            })
                .then(function(result) {
                });
        };

        $scope.deleteNotification = function (notificationId) {
            NotificationService.deleteNotification(notificationId).then(function(result) {
                for (var i = 0; i < notificationsList.length; i++) {
                    if(notificationsList[i].id == notificationId){
                        notificationsList.splice(i, 1);
                        $scope.notificationsList = notificationsList;
                    }
                }
            });
        };

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('PageSettingsController', PageSettingsController);

    function PageSettingsController($scope, $window, $timeout, pagesList, $stateParams, AddPageService) {
        $scope.pagesList = pagesList;
        $scope.pageId = $stateParams.pageId;
        $scope.addPage = AddPageService.setStatus(false);

        $timeout(function() {
            var currentState = $window.location.hash;
            var tabOfCurrentState = currentState.split("/");
            var index = tabOfCurrentState.indexOf('pageSettings');
            var active = tabOfCurrentState[index+1];
            $scope.active = active;
        }, 100);

        $scope.setActive = function (name) {
            $scope.active = name;
        };

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('ProfileController', ProfileController);

    function ProfileController($scope, $window, $rootScope, AuthService) {
        var user = $rootScope.currentUser;
        $scope.userId = user.id;
        $scope.email = user.email;
        $scope.name = user.name;
        $scope.telephone = user.telephone;

        $scope.settingsAccount = function () {
            AuthService.settingsAccount({
                email: $scope.email,
                previousPassword: $scope.previousPassword,
                password: $scope.password,
                password_confirmation: $scope.passwordConfirmation,
                name: $scope.name,
                telephone: $scope.telephone
            })
                .then(function(result) {
                    var user = JSON.stringify(result.data.user);
                    $window.localStorage.setItem('user', user);
                    $rootScope.currentUser = result.data.user;
                });
        };

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('RegisterController', RegisterController);

    function RegisterController($scope, $state, $stateParams, RegisterService, $window) {
        $scope.email = '';
        $scope.url = '';
        $scope.name = '';
        $scope.telephone = '';
        $scope.confirmation_code = $stateParams.confirmation_code;
        $scope.emailparam = $stateParams.email;

        if(RegisterService.message && RegisterService.message.status ){
            $scope.message = RegisterService.message.content;
        }

        $scope.registerStepOne = function () {
            RegisterService.registerStepOne($scope.email).then(function(result) {
                $state.go('nav.register-second');
            });
        };

        $scope.registerStepSecond = function () {
            RegisterService.registerStepSecond({
                namePage: $scope.namePage,
                name: $scope.name,
                url: $scope.url,
                telephone: $scope.telephone
            })
                .then(function(result) {
                $state.go('nav.login');
                });
        };

        $scope.registerStepThird = function () {
            RegisterService.registerStepThird({
                password: $scope.password,
                password_confirmation: $scope.password_confirmation,
                email: $scope.emailparam
            })
                .then(function(result) {
                $window.localStorage.setItem('showWelcome', true);
                $state.go('nav.login');
                });
        };
    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('RemindPasswordController', RemindPasswordController);

    function RemindPasswordController($scope, $state, AuthService) {
        $scope.email = '';

        $scope.remindPassword = function () {
            AuthService.remindPassword($scope.email).then(function(result) {
                $state.go('register');
            });
        };


    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .controller('ResetPasswordController', ResetPasswordController);

    function ResetPasswordController($scope, $stateParams, $state,AuthService) {
        $scope.tokenParam = $stateParams.token;
        $scope.email = '';
        $scope.password = '';
        $scope.passwordConfirmation = '';

        $scope.resetPassword = function () {
            AuthService.resetPassword({
                token: $scope.tokenParam,
                email: $scope.email,
                password: $scope.password,
                password_confirmation: $scope.passwordConfirmation
            })
                .then(function(result) {
                    $state.go('nav.login');
                });
        };


    }
}());
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
(function() {
    'use strict';

    angular
        .module('application')
        .controller('UserController', UserController);

    function UserController($scope, $auth, $rootScope, $state) {

        $scope.logout = function() {
            $auth.logout().then(function() {
                localStorage.removeItem('user');
                $rootScope.authenticated = false;
                $rootScope.currentUser = null;
                $state.go('nav.login');
            });
        }

    }
}());

(function() {
    'use strict';

    angular
        .module('application')
        .controller('WelcomeController', ['$scope', 'page', WelcomeController]);

    function WelcomeController($scope, page) {
        $scope.pageId = page.id;
    }
}());
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
(function() {
    'use strict';

    angular
        .module('application')
        .service('AuthService', AuthService);

    function AuthService($http) {
        var self = this;

        self.remindPassword = function (email) {
            return $http({
                method: 'POST',
                url: 'api/password/email',
                data: {
                    email: email
                }
            });
        };

        self.resetPassword = function (credentials) {
            return $http({
                method: 'POST',
                url: 'api/password/reset',
                data: credentials
            });
        };

        self.settingsAccount = function (data) {
            return $http({
                method: 'POST',
                url: 'api/user/settingsAccount',
                data: data
            });
        };

    }
}());
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
(function() {
    'use strict';

    angular
        .module('application')
        .service('MessagesService', MessagesService);

    function MessagesService(alertify) {

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
(function() {
    'use strict';

    angular
        .module('application')
        .service('NotificationService', NotificationService);

    function NotificationService($http) {
        var self = this;

        self.addNotification = function (notification) {
            return $http({
                method: 'POST',
                url: 'api/notifications',
                data: notification
            });
        };

        self.editNotification = function (notification) {
            return $http({
                method: 'PUT',
                url: 'api/notifications/'+notification.id,
                data: notification
            });
        };

        self.getNotifications = function (pageId) {
            return $http({
                method: 'GET',
                url: 'api/notifications/'+pageId
            });
        };

        self.getNotificationById = function (id) {
            return $http({
                method: 'GET',
                url: 'api/notification/'+id
            });
        };

        self.deleteNotification = function (notificationId) {
            return $http({
                method: 'DELETE',
                url: 'api/notifications/'+notificationId
            });
        };

    }
}());
(function() {
    'use strict';

    angular
        .module('application')
        .service('PageService', PageService);

    function PageService($http) {
        var self = this;

        self.step1data = {};
        self.message = {
            status: '',
            message: ''
        };


        self.showPage = function (id) {
            return $http({
                method: 'GET',
                url: 'api/pages/'+id
            });
        };

        self.getPageById = function (id) {
            return $http({
                method: 'GET',
                url: 'api/page/'+id
            });
        };

        self.getPageByUserId = function (userId) {
            return $http({
                method: 'GET',
                url: 'api/page/user/'+userId
            });
        };

        self.editPage = function (page) {
            return $http({
                method: 'PUT',
                url: 'api/pages/'+page.id,
                data: page
            });
        };

        self.addPage = function (page) {
            return $http({
                method: 'POST',
                url: 'api/pages',
                data: page
            });
        };

        self.deletePage = function (pageId) {
            return $http({
                method: 'DELETE',
                url: 'api/pages/'+pageId
            });
        };

    }
}());
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