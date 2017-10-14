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

            $urlRouterProvider.otherwise('/estates');

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
                url: '/edit-estate/{id}',
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
            $httpProvider.interceptors.push(['$q', 'alertify', '$rootScope', '$state', 'AlertService', function ($q, alertify, $rootScope, $state, AlertService) {
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
    .controller('addEstateController', AddEstateController);

  function AddEstateController($scope, EstatesService, AuthService, $state) {
    $scope.city = '';
    $scope.street = '';
    $scope.price = '';
    $scope.rooms = '';
    $scope.surface = '';
    $scope.floor = '';
    $scope.balcony = false;
    $scope.description = '';
    $scope.photoUploaded = false;

    $scope.buttonEnabled = false;

    $scope.$watch('[city ,street, price, rooms, surface, floor, balcony, description]', function () {
      $scope.buttonEnabled =
        $scope.city
        && $scope.street
        && $scope.price
        && $scope.rooms
        && $scope.surface
        && $scope.floor
        && $scope.description
    }, true);

    $scope.addEstate = function () {
      EstatesService.addEstate({
        city: $scope.city,
        street: $scope.street,
        price: $scope.price,
        rooms: $scope.rooms,
        surface: $scope.surface,
        floor: $scope.floor,
        balcony: $scope.balcony,
        description: $scope.description,
        userID: AuthService.userID,
      })
        .then(function (response) {
          if ( response.data.success ) {
            $state.go('estates');
          }
        })
    }
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
    .controller('editEstateController', EditEstateController);

  function EditEstateController($scope, EstatesService, AuthService, $state, $stateParams) {
    $scope.city = '';
    $scope.street = '';
    $scope.price = '';
    $scope.rooms = '';
    $scope.surface = '';
    $scope.floor = '';
    $scope.balcony = false;
    $scope.description = '';
    $scope.id = '';

    $scope.buttonEnabled = false;

    EstatesService.fetchEstateById($stateParams.id)
      .then(function (response) {
        var estateData = response.data.offer;
        $scope.id = estateData.id;
        $scope.city = estateData.city;
        $scope.street = estateData.street;
        $scope.price = estateData.price;
        $scope.rooms = estateData.no_rooms;
        $scope.surface = estateData.apartment_area;
        $scope.floor = estateData.floors;
        $scope.balcony = estateData.balcony;
        $scope.description = estateData.description;
      });

    $scope.$watch('[city ,street, price, rooms, surface, floor, balcony, description]', function () {
      $scope.buttonEnabled =
        $scope.city
        && $scope.street
        && $scope.price
        && $scope.rooms
        && $scope.surface
        && $scope.floor
        && $scope.description
    }, true);

    $scope.updateEstate = function () {
      EstatesService.updateEstate({
        id: $scope.id,
        city: $scope.city,
        street: $scope.street,
        price: $scope.price,
        rooms: $scope.rooms,
        surface: $scope.surface,
        floor: $scope.floor,
        balcony: $scope.balcony,
        description: $scope.description,
        userID: AuthService.userID,
      })
        .then(function (response) {
          if ( response.data.success ) {
            $state.go('estates');
          }
        })
    }
  }
}());
(function() {
  'use strict';

  angular
    .module('application')
    .controller('EstatesController', EstatesController);

  function EstatesController($scope, EstatesService, FilterService, AuthService) {
    $scope.estates = [];
    $scope.filteredEstates = [];
    $scope.userId = AuthService.userID;
    $scope.filters = Object.assign({}, FilterService.filters);

    EstatesService.fetchAllEstates()
      .then(function (response) {
        $scope.estates = response.data.offers || [];
        $scope.filteredEstates = response.data.offers || [];
      });

    $scope.setSold = function (offerID) {
      EstatesService.setSold(offerID);
    };

    $scope.buy = function (offer) {
      EstatesService.buy($scope.userId, offer.user_id, offer.id);
    };

    $scope.remove = function (offerID) {
      EstatesService.remove(offerID);
    };

    $scope.updateFilter = function(name) {
      FilterService.updateFilter(name, $scope.filters[name]);
    };

    $scope.$on(FilterService.status.FILTERS_UPDATED, function(filters) {
      $scope.filteredEstates = FilterService.filterList($scope.estates);
    })
  }
}());
(function() {
  'use strict';

  angular
    .module('application')
    .controller('MessagesController', MessagesController);

  function MessagesController($scope, MessagesService, AuthService) {
    $scope.messages = [];
    MessagesService.fetchAllMessages(AuthService.userID)
      .then(function (response) {
        $scope.messages = response.data.messages;
      });
  }
}());
(function() {
  'use strict';

  angular
    .module('application')
    .controller('RegisterController', RegisterController);

  function RegisterController($scope, AuthService, $state) {
    $scope.email = '';
    $scope.phone = '';
    $scope.password = '';
    $scope.passwordAgain = '';
    $scope.buttonEnabled = true;

    $scope.$watch('[email, phone, password, passwordAgain]', function () {
      $scope.buttonEnabled =
        $scope.phone.toString().length < 10
        && !(
          $scope.password !== ''
          && $scope.passwordAgain !== ''
          && $scope.password !== $scope.passwordAgain
        )
    }, true);

    $scope.register = function () {
      AuthService.register($scope.email, $scope.phone, $scope.password)
        .then(function (response) {
          if ( response.data.success ) {
            $state.go('login');
          }
        })
    }
  }
}());
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
(function () {
  'use strict';

  angular
    .module('application')
    .service('AuthService', AuthService);

  function AuthService($http) {
    var self = this;
    self.userID = 3;

    self.register = function (email, number, password) {
      return $http({
        method: 'POST',
        url: '/api/register',
        data: {
          email: email,
          telephone: number,
          password: password,
          password_confirmation: password
        }
      });
    }

  }
}());
(function() {
  'use strict';

  angular
    .module('application')
    .service('EstatesService', EstatesService);

  function EstatesService($http) {
    var self = this;
    self.status = {
      PHOTO_UPLOADED: 'PHOTO_UPLOADED'
    };
    self.currentPhoto = '';

    self.fetchAllEstates = function () {
      return $http({
        method: 'GET',
        url: '/api/offers'
      });
    };

    self.fetchEstateById = function (id) {
      return $http({
        method: 'GET',
        url: '/api/offers/' + id
      });
    };

    self.sendPhoto = function (photo) {
      var updateData = new FormData();
      updateData.append('file', photo);

      return $http({
        method: 'POST',
        data: updateData,
        url: '/api/upload',
        headers: {'Content-Type': undefined }
      });
    };

    self.loadCurrentPhoto = function (url) {
      console.log(url);
      self.currentPhoto = url;
    };

    self.addEstate = function (data) {
      return $http({
        method: 'POST',
        url: '/api/offers',
        data: {
          city: data.city || '',
          street: data.street || '',
          images: self.currentPhoto,
          no_rooms: data.rooms || '',
          apartment_area: data.surface || '',
          floors: data.floor || '',
          balcony: data.balcony || false,
          description: data.description || '',
          price: data.price || '',
          user_id: data.userID || '',
        }
      });
    };

    self.updateEstate = function (data) {
      return $http({
        method: 'PUT',
        url: '/api/offers/' + data.id,
        data: {
          city: data.city || '',
          street: data.street || '',
          images: self.currentPhoto,
          no_rooms: data.rooms || '',
          apartment_area: data.surface || '',
          floors: data.floor || '',
          balcony: data.balcony || false,
          description: data.description || '',
          price: data.price || '',
          user_id: data.userID || '',
        }
      });
    };

    self.setSold = function (offerID) {
      return $http({
        method: 'PUT',
        url: '/api/offers/' + offerID + '/status',
        data: {
          status: false
        }
      });
    };

    self.unsetSold = function (offerID) {
      return $http({
        method: 'PUT',
        url: '/api/offers/' + offerID + '/status',
        data: {
          status: true
        }
      });
    };

    self.buy = function (senderID, recipientID, offerID) {
      return $http({
        method: 'post',
        url: '/api/messages',
        data: {
          sender_id: senderID,
          recipient_id: recipientID,
          offer_id: offerID
        }
      });
    };

    self.remove = function (offerID) {
      return $http({
        method: 'DELETE',
        url: '/api/offers/' + offerID,
      });
    };

  }
}());
(function() {
  'use strict';

  angular
    .module('application')
    .service('FilterService', FilterService);

  function FilterService($rootScope) {
    var self = this;

    self.status = {
      FILTERS_UPDATED: 'FILTERS_UPDATED'
    };

    self.filters = {
      floor: null,
      priceFrom: null,
      priceTo: null,
      surfaceFrom: null,
      surfaceTo: null,
      roomsFrom: null,
      roomsTo: null
    };

    self.updateFilter = function (name, value) {
      self.filters[name] = value;
      $rootScope.$broadcast(self.status.FILTERS_UPDATED, self.filters);
    };

    self.filterList = function (list) {
      return list.filter(function (item) {
        var f = self.filters;
        if ( f.floor && item.floors !== f.floor ) {
          return false;
        }
        if ( f.priceFrom && item.price < f.priceFrom ) {
          return false;
        }
        if ( f.surfaceFrom && item.apartment_area < f.surfaceFrom ) {
          return false;
        }
        if ( f.roomsFrom && item.no_rooms < f.roomsFrom ) {
          return false;
        }
        if ( f.priceTo && item.price > f.priceTo ) {
          return false;
        }
        if ( f.surfaceTo && item.apartment_area > f.surfaceTo ) {
          return false;
        }
        if ( f.roomsTo && item.no_rooms > f.roomsTo ) {
          return false;
        }
        return true;
      })
    }
  }
}());
(function() {
  'use strict';

  angular
    .module('application')
    .service('MessagesService', MessagesService);

  function MessagesService($http) {
    var self = this;

    self.fetchAllMessages = function (id) {
      return $http({
        method: 'GET',
        url: '/api/messages/' + id
      });
    }
  }
}());