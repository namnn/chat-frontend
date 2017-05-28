	(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$http', '$q', 'dataservice', 'logger', '$state', '$filter', '$window', '$rootScope'];
    /* @ngInject */
    function LoginController($http, $q, dataservice, logger, $state, $filter, $window, $rootScope) {
        var vm = this;

        vm.title = 'Login';
        vm.login = login;
        vm.signup = signup;
        vm.toggleView = toggleView;
        vm.view = 1;

        activate();

        function activate() {
            $rootScope.$broadcast("SuccessGetPrivilege", {level: -1});

            var promises = [dataservice.hideSidebar()];
            return $q.all(promises).then(function() {
            });
        }

        function login(obj) {
            var objToSend = {user: obj};

            return dataservice.login(objToSend).then(function(data) {
                if (data === false) {
                    logger.error("Unable to login!");
                } else {
                    console.log(data);
                    vm.current = data.me;
                    vm.logged_in = true;
                    console.log(data);

                    $rootScope.$broadcast("SuccessLogin", {
                        "user": vm.current
                    });
                    localStorage.setItem("chatuser", JSON.stringify(vm.current));

                    $rootScope.$broadcast("SuccessGetPrivilege", {
                        "level": 0
                    });
                    $state.transitionTo('dashboard');
                }
            });
        }

        function signup(obj) {
            var objToSend = {user: obj};

            return dataservice.signup(objToSend).then(function(data) {
               if (data === false) {
                   logger.error("Unable to sign up!");
               } else {
                   logger.success("Successfully signed up!");
                   toggleView(1);
               }
            });
        }

        function toggleView(val) {
            vm.view = val;
        }
    }
})();
