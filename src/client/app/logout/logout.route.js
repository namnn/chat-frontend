(function() {
    'use strict';

    angular
        .module('app.logout')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'logout',
                config: {
                    url: '/',
                    templateUrl: 'app/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Sign out',
                    hideFromSidebar: true,
                    noTab: true,
                    settings: {
                        nav: 1,
                        // content: '<i class="logout-logo"></i> <span class="logout-title-color">Sign Out</span>'
                        name: "Signout",
                        className: "fa fa-sign-out",
                        level: 0
                    }
                }
            }
        ];
    }
})();
