var builder = require('botbuilder');
var restify = require('restify');
var emoji = require('node-emoji')

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var userStore = [];
var bot = new builder.UniversalBot(connector, function (session) {
	var address = session.message.address;
    userStore.push(address);
    session.endDialog('resurrecting AccountaBunny from the dead...');
});

// Every 5 seconds, check for new registered users and start a new dialog
setInterval(function () {
    var newAddresses = userStore.splice(0);
    newAddresses.forEach(function (address) {

        console.log('Starting AccountaBunny:', address);

        // new conversation address, copy without conversationId
        var newConversationAddress = Object.assign({}, address);
        delete newConversationAddress.conversation;

        // start survey dialog
        bot.beginDialog(newConversationAddress, 'survey', null, (err) => {
            if (err) {
                // error ocurred while starting new conversation. Channel not supported?
                bot.send(new builder.Message()
                    .text('This channel does not support this operation: ' + err.message)
                    .address(address));
            }
        });

    });
}, 5000);

function getCalls(){
	return ['Call1', 'Call2', 'Call3'];
}

bot.dialog('survey', [
    function (session) {
    	builder.Prompts.text(session, 'Hey, I\’m AccountaBunny' + emoji.get('rabbit') + ' I\’m here to help you become a contributing member of society (like in a fun way)!')
        //wait
        builder.Prompts.text(session, 'First things first, what\'s your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, 'Hi ' + results.response + ', Next, we need to establish your base of operations. What\’s your zipcode?');
    },
    function (session, results) {
        session.userData.zipcode = results.response;
        builder.Prompts.choice(session, 'And a rebel without a cause is a pretty lame rebel. Here’s some shit that\’s going down right now, enter the numbers of the ones that are important to you: ', getCalls());
    },
    function (session, results) {
        session.userData.call = results.response.entity;
        session.endDialog('Got it... ' + session.userData.name +
            ' you\'re interested in ' + session.userData.call + '.');
    }
]);