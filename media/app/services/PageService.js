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