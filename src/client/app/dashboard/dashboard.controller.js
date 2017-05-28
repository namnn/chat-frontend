	(function () {
    'use strict';

    angular
        .module('app.dashboard', ['ngSanitize', 'luegg.directives'])
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', 'dataservice', 'logger', '$rootScope', '$state', '$timeout', '$scope'];
    /* @ngInject */
    function DashboardController($q, dataservice, logger, $rootScope, $state, $timeout, $scope) {
        var vm = this;

        vm.title = 'Dashboard';
        vm.conversation = {};
        vm.chatboxes = [];

        vm.removeBox = removeBox;

        $rootScope.$on("OpenChat", function (event, data) {
            getConversation(data);
        });

        activate();

        function activate() {
            var promises = [init()];
            return $q.all(promises).then(function() {
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

        function getConversation(friend) {
            var existingBox = vm.chatboxes.filter(function(item) {
               return item.friend.username == friend.username;
            });

            if (existingBox && existingBox.length > 0)
                return;

            return dataservice.getConversation(friend._id).then(function(data) {
               if (data === false) {
                   logger.error("There is a connection problem!");
               } else {
                   var newChatBox = {
                       friend: friend,
                       conversation: data,
                       message: "",
                       typing: false,
                       metyping: false,
                       timeout: null,
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

            socket.on('announcement', function(announcement) {
                // Announcement
                if (!announcement)
                    return;

                if (!announcement.message)
                    return;

                logger.info(announcement.message);
                $rootScope.$broadcast('NewAnnouncement', announcement.user);
            });

            socket.on('disconnect', function() {
                // Send disconnect event
                socket.emit('disconnect', vm.current);
            });

            socket.on('text', function(message) {
                $scope.$apply(function() {
                    vm.chatboxes.filter(function(item) {
                        if (item.friend.username == message.username) {
                            item.conversation = {
                                messages: item.conversation.messages ? item.conversation.messages : []
                            };
                            item.conversation.messages.push(message);
                            return;
                        }
                    });

                    logger.info(message.author + " just messaged you.");
                });
            });

            socket.on('noLongerTypingMessage', function(friend_username) {
                $scope.$apply(function() {
                    for (var i = 0; i < vm.chatboxes.length; i++) {
                        if (vm.chatboxes[i].friend.username == friend_username) {
                            vm.chatboxes[i].typing = false;
                            return;
                        }
                    }
                });
            });

            socket.on('typingMessage', function(friend_username) {
                $scope.$apply(function() {
                    for (var i = 0; i < vm.chatboxes.length; i++) {
                        if (vm.chatboxes[i].friend.username == friend_username) {
                            vm.chatboxes[i].typing = true;
                            return;
                        }
                    }
                });
            });

            vm.sendChat = sendChat;
            vm.checkTyping = checkTyping;
            vm.stoppedTyping = stoppedTyping;

            function sendChat(input, from, to) {
                if (!input || input == "")
                    return;

                var objToSend = {from: from._id, to: to._id, content: input};
                socket.emit('text', objToSend, function(date) {
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

            function checkTyping(box) {
                box.metyping = true;
                if(box.timeout) {
                    $timeout.cancel(box.timeout);
                }
                socket.emit('typingMessage', box.friend);
            }

            function stoppedTyping(box) {
                box.timeout = $timeout(function() {
                    box.metyping = false;
                    socket.emit('noLongerTypingMessage', box.friend);
                }, 2000)
            }
        }

        function removeBox(box) {
            for (var i = 0; i < vm.chatboxes.length; i++) {
                if (box == vm.chatboxes[i]) {
                    vm.chatboxes.splice(i, 1);
                    return;
                }
            }
        }
    }
})();
