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

            $urlRouterProvider.otherwise('/estates');

            $stateProvider
              .state('nav', {
                abstract: true,
                templateUrl: 'views/nav.html'
              })
              .state('register',{
                controller: 'RegisterController',
                url: '/register',
                templateUrl: 'views/register.html'
              })
              .state('login',{
                controller: 'LoginController',
                url: '/login',
                templateUrl: 'views/login.html'
              })
              .state('nav.add-estate',{
                url: '/add-estate',
                views: {
                  '': {
                    templateUrl: 'views/addEstate.html',
                    controller: 'addEstateController'
                  }
                }
              })
              .state('nav.edit-estate',{
                url: '/edit-estate/{id}',
                views: {
                  '': {
                    templateUrl: 'views/editEstate.html',
                    controller: 'editEstateController'
                  }
                }
              })
              .state('nav.estates',{
                url: '/estates',
                views: {
                  '': {
                    controller: 'EstatesController',
                    templateUrl: 'views/estates.html'
                  }
                }
              })
              .state('nav.messages',{
                url: '/messages',
                views: {
                  '': {
                    controller: 'MessagesController',
                    templateUrl: 'views/messages.html'
                  }
                }
              })
              .state('nav.users',{
                url: '/users',
                views: {
                  '': {
                    controller: 'UsersController',
                    templateUrl: 'views/users.html'
                  }
                }
              })
              .state('nav.changePassword',{
                url: '/changePassword/{id}',
                views: {
                  '': {
                    controller: 'ChangePasswordController',
                    templateUrl: 'views/changePassword.html'
                  }
                }
              })
              .state('nav.report',{
                url: '/report/{month}/{year}',
                views: {
                  '': {
                    controller: 'ReportController',
                    templateUrl: 'views/report.html'
                  }
                }
              });

            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common["X-Requeste    d-With"];
            $httpProvider.defaults.headers.common["Accept"] = "application/json";
            $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
            $httpProvider.interceptors.push(['$q', 'alertify', '$rootScope', '$state', 'AlertService', function ($q, alertify, $rootScope, $state, AlertService) {
                return {
                    'responseError': function (response) {
                        if(response.status === 400) {
                            if(response.data.error == 'token_not_provided'){
                                    localStorage.removeItem('satellizer_token');
                                    localStorage.removeItem('user');
                                    $rootScope.authenticated = false;
                                    $rootScope.currentUser = null;
                                    response.data.error = 'Zaloguj się ponownie';
                                    $state.go('login');
                            }
                            AlertService.showMessage(response.data);
                        }
                        if(response.status === 401) {
                            if(response.data.error == 'invalid_credentials'){
                                var msg = {
                                    error: 'Podano błędny email lub hasło'
                                };
                                AlertService.showMessage(msg);
                                $state.go('nav.login');
                            }
                            console.error("Brak autoryzacji");
                            $state.go('nav.login');
                        }

                        return $q.reject(response);
                    },

                    response: function (response) {
                        if(response.status === 200 && typeof response.data.success !== 'undefined') {
                            AlertService.messageSuccess(response.data);
                        }
                        return response;
                    }


                };
            }]);


        }
    ]);