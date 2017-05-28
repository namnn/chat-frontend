	(function () {
    'use strict';

    angular
        .module('app.logout')
        .controller('logoutController', logoutController);

    logoutController.$inject = ['$q', 'dataservice', 'logger', '$state', '$filter', '$window', '$rootScope'];
    /* @ngInject */
    function logoutController($q, dataservice, logger, $state, $filter, $window, $rootScope) {
        var vm = this;

        vm.today = new Date();
        vm.title = 'logout';

        // Boolean for ng-if
        activate();

        function activate() {
            var promises = [];
            return $q.all(promises).then(function() {
                logger.info('Activated logout View');
            });
        }


    }
})();
