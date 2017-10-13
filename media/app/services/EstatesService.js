(function() {
  'use strict';

  angular
    .module('application')
    .service('EstatesService', EstatesService);

  function EstatesService($http) {
    var self = this;

    self.fetchAllEstates = function () {
      return $http({
        method: 'GET',
        url: '/api/offers'
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

  }
}());