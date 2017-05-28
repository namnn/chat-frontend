	(function () {
    'use strict';

    angular
        .module('app.dashboard', ['ngSanitize', 'luegg.directives'])
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'dataservice', 'logger', '$rootScope', '$state', '$window', '$scope'];
    /* @ngInject */
    function DashboardController($q, dataservice, logger, $rootScope, $state, $window, $scope) {
        var vm = this;

        vm.title = 'Dashboard';
        vm.conversation = {};
        vm.chatboxes = [];

        activate();

        function activate() {
            var promises = [init()];
            return $q.all(promises).then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function init() {
            if (!localStorage.getItem("chatuser")) {
                $rootScope.$broadcast("SuccessGetPrivilege", {level: -1});
                $state.transitionTo('login');
            }

            return dataservice.loadIndex().then(function (response) {
                if (response === false) {
                   $state.transitionTo('login');
                }

                dataservice.showSidebar();
                $rootScope.$broadcast("SuccessGetPrivilege", {
                    "level": 0
                });
                if (response.data.authenticated) {
                    console.log(response.data);
                    vm.logged_in = true;
                    vm.current = response.data.me;
                    vm.chat_msg = response.data.chat_msg;

                    chat();
                    vm.results = false;
                    vm.postResults = false;
                } else {
                    $state.transitionTo('login');
                }
            });
        }

        $rootScope.$on("OpenChat", function (event, data) {
            getConversation(data);
        });

        function getConversation(friend) {
            return dataservice.getConversation(friend._id).then(function(data) {
               if (data === false) {
                   logger.error("There is a connection problem!");
               } else {
                   var newChatBox = {
                       friend: friend,
                       conversation: data,
                       message: ""
                   };
                   vm.chatboxes.push(newChatBox);
               }
            });
        }

        function chat() {
            var socket = io.connect("http://localhost:8000");
            socket.on('connect', function() {
                // Send join event
                socket.emit('join', vm.current);
            });

            socket.on('text', function(message) {
                $scope.$apply(function() {
                    vm.chatboxes.filter(function(item) {
                        if (item.friend.username == message.username) {
                            item.conversation = {
                                messages: item.conversation.messages ? item.conversation.messages : []
                            };
                            item.conversation.messages.push(message);
                        }
                    });
                });
            });

            vm.sendChat = sendChat;

            function sendChat(input, from, to) {
                if (!input || input == "")
                    return;

                var objToSend = {from: from._id, to: to._id, content: input};
                console.log(objToSend);
                socket.emit('text', objToSend, function(date) {
                    console.log(date);
                    $scope.$apply(function() {
                        if (!input || input == "")
                            return;

                        var msg = {
                            author: from.first + ' ' + from.last,
                            username: from.username,
                            content: input,
                            date: date
                        };

                        vm.chatboxes.filter(function(item) {
                            if (item.friend.username == to.username) {
                                item.message = "";
                                item.conversation = {
                                    messages: item.conversation.messages ? item.conversation.messages : []
                                };
                                item.conversation.messages.push(msg);
                            }
                        });
                    });
                });

                return false;
            }
        }
    }
})();
