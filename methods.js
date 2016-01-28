/**
 *
 * @author  Johan Kasselman
 * @since   27-01-2016
 *
 * puruText: Simple chatRoom with history and users etc.
 */

if (Meteor.isServer) {
    Meteor.methods({

        insertMessage: function (newMessage, roomId) {
            Messages.insert({
                text: newMessage,                  // message text
                createdAt: new Date(),             // current time
                owner: Meteor.userId(),            // _id of logged in user
                username: Meteor.user().username,   // username of logged in user
                roomid: roomId
            });
        },

        deleteMessage: function (messageId, owner) {

            if(Meteor.userId() == owner){
                //console.log('delete message!!!');
                Messages.remove({
                    _id: messageId
                });
            }else{
                //console.log('Permission Denied!');
            }
        }
    })
};