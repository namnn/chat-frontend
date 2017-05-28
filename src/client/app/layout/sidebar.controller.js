(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController);


    SidebarController.$inject = ['$state', 'routerHelper', '$window', '$rootScope', 'logger', 'dataservice', 'config', '$websocket', '$q'];
    /* @ngInject */
    function SidebarController($state, routerHelper, $window, $rootScope, logger, dataservice, config, $websocket, $q) {
        var vm = this;
        var states = routerHelper.getStates();
        var calendarIntervalID, todoIntervalID;

        // variables
        vm.displayedNotify = {};
        vm.offset;
        //declare function
        vm.logout = logout;
        vm.isCurrent = isCurrent;
        vm.getChildrenNavRoutes = getChildrenNavRoutes;
        vm.getTitle = getTitle;
        vm.currentUser = "";
        vm.imageURL = "";

        vm.adminLevel = 0;
        vm.friends = [];

        activate();

        function activate() {
            var promises = [getNavRoutes(), init()];
            return $q.all(promises).then(function() {
                console.log("Called sidebar controller");
            });
        }

        function init() {

        }



        function getNavRoutes() {
            vm.navRoutes = states.filter(function(r) {
                return r.settings && r.settings.level <= vm.adminLevel && r.settings.nav < 2;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function getChildrenNavRoutes(parent) {
            return states.filter(function(r) {
                return r.settings && r.settings.nav === 2 && r.settings.parent === parent && r.settings.level <= vm.adminLevel;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }

            var menuName = route.title;
            var message = $state.current.title.substr(0, menuName.length) === menuName ? 'active' : '';

            if (message == 'active' && !route.hasChildren) {
                var elements = document.getElementsByClassName('treeview-menu');
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].id != route.settings.parent + '-subtree') {
                        $(elements[i]).slideUp('slow');
                    }
                }

                elements = document.getElementsByClassName('active');
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].id == route.settings.parent || elements[i].id == route.title) {} else {
                        elements[i].classList.remove('active');
                    }
                }

                if (route.settings.parent) {
                    var parent = document.getElementById(route.settings.parent);
                    var element = document.getElementById(route.settings.parent + '-subtree');

                    if (parent)
                        parent.classList.add('active');
                    if (element) {
                        element.classList.add('menu-open');
                        element.setAttribute('style', 'display: block');
                    }
                }
            }

            return message;
        }

        function getTitle(route) {
            return route.title;
        }

        function logout() {
            var sessionObj = localStorage.getItem('chatuser');
            if (sessionObj) {
                sessionObj = JSON.parse(sessionObj);
                return dataservice.logout().then(function(data) {
                    $rootScope.$broadcast("SuccessLogout");
                    $rootScope.$broadcast("SuccessGetPrivilege", {level: -1});
                    localStorage.clear();
                    sessionStorage.clear();
                    $state.transitionTo('login');
                });
            }
        }
    }
})();
