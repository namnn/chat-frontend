(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];
    /* @ngInject */
    function ShellController($rootScope, $timeout, config, logger) {
        var vm = this;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.isLoggedIn = false;
        vm.adminLevel = -1;

        $rootScope.showSplash = true;
        vm.navline = {
            title: config.appTitle,
            text: 'Simple Chat',
            link: '/',
            today: new Date()
        };

        activate();

        $rootScope.$on("SuccessGetPrivilege", function(event, data) {
            vm.adminLevel = data.level;
        });

        $rootScope.$on("SuccessLogin", function() {
            vm.isLoggedIn = true;
        });

        $rootScope.$on("SuccessLogout", function() {
            vm.isLoggedIn = false;
        });

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            hideSplash();

            if (localStorage.getItem('user')) {
                vm.isLoggedIn = true;
            }
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                $rootScope.showSplash = false;
            }, 1000);
        }
    }
})();
