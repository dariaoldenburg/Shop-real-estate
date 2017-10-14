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

    self.fetchEstateByUserId = function (id) {
      return $http({
        method: 'GET',
        url: '/api/offers/user/' + id
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
          user_id: data.userID,
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