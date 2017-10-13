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
            $httpProvider.interceptors.push(['$q', 'alertify', '$rootScope', '$state', function ($q, alertify, $rootScope, $state) {
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
                            // MessagesService.showMessage(response.data);
                        }
                        if(response.status === 401) {
                            if(response.data.error == 'invalid_credentials'){
                                var msg = {
                                    error: 'Podano błędny email lub hasło'
                                };
                                // MessagesService.showMessage(msg);
                                $state.go('nav.login');
                            }
                            console.error("Brak autoryzacji");
                            $state.go('nav.login');
                        }

                        return $q.reject(response);
                    },

                    response: function (response) {
                        if(response.status === 200 && typeof response.data.success !== 'undefined') {
                            // MessagesService.messageSuccess(response.data);
                        }
                        return response;
                    }


                };
            }]);


        }
    ]);