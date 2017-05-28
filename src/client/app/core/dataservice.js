(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'exception', 'logger', 'config'];
    /* @ngInject */
    function dataservice($http, $q, exception, logger, config) {
        var service = {
            signup: signup,
			login:  login,
            logout: logout,
            loadIndex: loadIndex,
            hideSidebar: hideSidebar,
            showSidebar: showSidebar,
            getFriends: getFriends,
            getConversation: getConversation
        };

        return service;

        function login(obj) {
            return $http.post(config.host + '/login', obj).then(success).catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return false;
            }
        }

        function signup(obj) {
            return $http.post(config.host + '/signup', obj).then(success).catch(fail);

            function success(data, status, header, config) {
                return data;
            }

            function fail(e) {
                return false;
            }
        }

        function logout() {
            return $http.get(config.host + '/logout').then(success).catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return false;
            }
        }

        function getConversation(_id) {
            return $http.get(config.host + '/conversation?id=' + _id).then(success).catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return false;
            }
        }

        function getFriends() {
            return $http.get(config.host + '/friends').then(success).catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(e) {
                return false;
            }
        }

        function loadIndex() {
            return $http.get(config.host + '/index').then(success).catch(fail);

            function success(response) {
                return response;
            }

            function fail(e) {
                return false;
            }
        }

        function showSidebar() {
            $('body').addClass('skin-black sidebar-mini').removeClass('layout-top-nav');
        }

        function hideSidebar(){     //remove sidebar
            $('body').addClass('layout-top-nav').removeClass('skin-black sidebar-mini');
        }
    }
})();
