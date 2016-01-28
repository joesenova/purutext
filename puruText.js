/**
 *
 * @author  Johan Kasselman
 * @since   27-01-2016
 *
 * puruText: Simple chatRoom with history and users etc.
 */

Messages = new Mongo.Collection('messages');
Files = new Mongo.Collection('files');

if (Meteor.isClient) {
    //--------------------------------------------------------
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    //--------------------------------------------------------
    angular.module('puruText',['angular-meteor', 'accounts.ui']);

    //--------------------------------------------------------
    function onReady() {
        angular.bootstrap(document, ['puruText']);
    }
    //--------------------------------------------------------
    if (Meteor.isCordova)
        angular.element(document).on('deviceready', onReady);
    else
        angular.element(document).ready(onReady);
    //--------------------------------------------------------
    angular.module('puruText')
        .value('moment', moment)
        .controller('MessagesListCtrl', ['$scope', '$meteor', '$interval', 'moment',
        function ($scope, $meteor, $interval) {


            $scope.rooms = [
                {name: "Casual", id: "1"},
                {name: "Work", id: "2"},
                {name: "Nerds!", id: "3"}

            ];
            //--------------------------------------------------------
            $scope.addMessage = function(newMessage) {
                if(newMessage > ''){
                    $scope.messages.push( {
                            text: newMessage,                  // message text
                            createdAt: new Date(),             // current time
                            owner: Meteor.userId(),            // _id of logged in user
                            username: Meteor.user().username,   // username of logged in user
                            roomid: $scope.roomId
                        }
                    );
                    Meteor.call("insertMessage", newMessage, $scope.roomId);
                }
            };
            //--------------------------------------------------------
            $scope.deleteMesasage = function(messageId, owner){
                Meteor.call("deleteMessage", messageId, owner);
            };
            //--------------------------------------------------------
            $scope.$watch('selectedRoom', function(newRoom){

                if(newRoom){
                    //console.log(newRoom);
                    $scope.roomId = newRoom;

                    $scope.messages = $meteor.collection( function() {
                        //console.log('Reload messages!!!');

                        return Messages.find({roomid: newRoom}, { sort: { createdAt: 1 } });
                    });
                }

            });
            //--------------------------------------------------------
            $scope.formatRawDate = function(rawDate){
                return moment(rawDate).fromNow();
            };

            //--------------------------------------------------------
        }
    ]);
}