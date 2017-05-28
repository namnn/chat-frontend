(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htTopNav', htTopNav);

    /* @ngInject */
    function htTopNav () {
        var directive = {
            bindToController: true,
            controller: TopNavController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'navline': '='
            },
            templateUrl: 'app/layout/ht-top-nav.html'
        };

        TopNavController.$inject = ['$state', 'routerHelper', '$window', '$rootScope', 'dataservice', 'config', '$q'];
        /* @ngInject */
        function TopNavController($state, routerHelper, $window, $rootScope, dataservice, config, $q) {
            var vm = this;
            var states = routerHelper.getStates();
            // variables
            vm.notification = {};
            vm.allNotification = {};
            vm.openchat = openchat;

            //declare function
            vm.activateRightNotificationBar = activateRightNotificationBar;
            vm.closeRightNotificationBar = closeRightNotificationBar;
            vm.notificationTransition = notificationTransition;

            $rootScope.$on("SuccessGetPrivilege", function(event, data) {
                if (data.level >= 0) {
                    getFriends();
                }
            });
            function getFriends() {
                return dataservice.getFriends().then(function(data) {
                    if (data === false) {

                    } else {
                        vm.friends = data.friends;
                    }
                });
            }

            $rootScope.$on("UpdateNotification", function(event, args) {
                vm.notification = args.unreadnotification;
                vm.allNotification = args.allNotification;
            });

            activate();

            function activate() {
                var promises = [init()];
                return $q.all(promises).then(function() {
                    console.log("Called ht-top-navController");
                });
            }

            function init() {
                return;
            }

            function openchat (obj) {
                $rootScope.$broadcast("OpenChat", obj);
            }

            // ------------------- Func for notification side bar -----------------
            function activateRightNotificationBar() {
                document.getElementById('rightNotificationBar').className += ' control-sidebar-open';
            }

            function closeRightNotificationBar() {
                document.getElementById('rightNotificationBar').classList.remove("control-sidebar-open");
            }

            function notificationTransition(state, id) { //transition for notification click
                var promises = [notificationservice.setViewed(id)];
                return $q.all(promises).then(function() {
                    $state.go(state, {}, {reload: true});
                });
            }
            // ---------------- END func for right side bar ----------------
        }

        return directive;
    }
})();
