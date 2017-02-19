var builder = require('botbuilder');
var restify = require('restify');
var emoji = require('node-emoji');
var sleep = require('sleep');
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

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

// Serve a static web page
server.get(/.*/, restify.serveStatic({
    'directory': '.',
    'default': 'index.html'
}));

var Connection = require('tedious').Connection;  
var config = {  
    userName: 'abadmin@accountabuddysvr',  
    password: 'w0mb@tab',  
    server: 'accountabuddysvr.database.windows.net',  
    // If you are on Microsoft Azure, you need this:  
    options: {encrypt: true, database: 'ABDB'}  
};  
var connection = new Connection(config);  
connection.on('connect', function(err) {
    if (err) return console.error("err: " + err);
    //executeStatement('phone', 'Users', 'userID');
    console.log("usernew() " + userNew());
});

var bot = new builder.UniversalBot(connector);

// Dialogs
var Action = require('./action');
var Involve = require('./involve');
var Issue = require('./issue');

// Setup dialogs
bot.dialog('action', Action.Dialog);
bot.dialog('involve', Involve.Dialog);
bot.dialog('issue', Issue.Dialog);

var phone = "";
var phones = ['5555555555','00000000000'];

function executeStatement(item, table, from) {  
    request = new Request("SELECT TOP 1 "+item+" FROM " + table + " WHERE "+from+"=001 ORDER BY RAND();", function(err) {  
    if (err) {  
        console.log("err: " + err);}  
    });  
    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log("RESULTS: " + result); 
        phone = result;
        result ="";  
        console.log("ph1: " + phone);
    });  

    request.on('done', function(rowCount, more) {  
    //console.log(rowCount + ' rows returned');  
    });  
    connection.execSql(request);  
}


// Root dialog
function getCalls(){
    return ['Call1', 'Call2', 'Call3'];
}

function getIntents(){
    return ['I have time today','I want to do something','Work on an issue'];
}

// http://i.imgur.com/dxaVAwf.png # excited bunny
// http://i.imgur.com/pH5B1R9.png # rip bunny 
// http://i.imgur.com/xpFl3in.png # k. bunny
// http://i.imgur.com/ITdZCrS.png # mad bunny
// http://i.imgur.com/wx2OQ1s.png # regular bunny

var newUser = false;

function userNew(){
    for(var num = 0; num<phones.length;num++){
        console.log("phone: " + phone);
        if(phone.localeCompare(phones[num])==1){
            newUser = false;
            console.log("ph3: " + phone);
            console.log("phones[0]: " + phones[0]);
            console.log("compare ph: " + phone.localeCompare(phones[0]));
            return false
        }
        //else if (phone == ""){
            //return true;
        //}
    } 
    return true;  
}

//should use useNew but couldn't figure out how to sync executeStatement()
if(newUser){
    console.log("NEW USER");
    bot.dialog('/', new builder.IntentDialog()
        .onDefault([
        function (session) {
            console.log("cpmpare:" + phone.localeCompare(phones[0]));
            console.log("ph4: " + phone);
        	session.send('Hey, I\’m AccountaBunny ' + emoji.get('rabbit') + ' I\’m here to help you become a contributing member of society (like in a fun way)!');
            var msg = new builder.Message(session)
                .attachments([{
                    contentType: "image/png",
                    contentUrl: "http://i.imgur.com/wx2OQ1s.png"
                }]);
            session.send(msg);
            //wait
            builder.Prompts.text(session, 'First things first, what\'s your name?');
        },
        /*function (session, results) {
            session.userData.name = results.response;
            builder.Prompts.number(session, 'Cool, thanks ' + results.response + '. Next, we need to establish your base of operations. What\’s your zipcode?');
        },*/
        function (session, results) {
            //session.userData.zipcode = results.response;
            builder.Prompts.choice(session, 'And a rebel without a cause is a pretty lame rebel. Here’s some shit that\’s going down right now. Enter the number of the issue you are most interested in today: ', getCalls());
        },
        function (session, results) {
            session.userData.call = results.response.entity;
            session.send('Got it ' + session.userData.name +
                ', you\'re interested in ' + session.userData.call + '.');
            //wait
            session.send('We do have some ground rules before we get started.');
            session.send('First, we need accurate numbers to track the results of our efforts, so don’t lie. **Honor system**');
            builder.Prompts.confirm(session, 'And that’s it, that’s literally the only rule! Ready to get started?');        
        },
        function (session, results) {
            if (!results.response) {
                session.send('okay I see how it is');
                var msg = new builder.Message(session)
                    .attachments([{
                        contentType: "image/png",
                        contentUrl: "http://i.imgur.com/xpFl3in.png"
                    }]);
                session.send(msg);
                return session.endDialog();
            }

            else if(results.response){
                session.send('Great! Here’s how this works: ');
                session.send('If you have some free time and want to help make this country a better place (or a less shitty place for those “glass half empty” folks), let me know by saying “I have [number] minutes of free time today”');
                session.send('If you know of an event, rally, or other way to get involved in your area, let me know by saying “I have a call to action” ');
                builder.Prompts.confirm(session, 'Make sense?');
            }
        },
        function (session, results){
            console.log("ENTER");
            if(!results.response){
                session.send('Well the best way to learn is to actually do the thing! Let’s try it.');
            }
            else if(results.response){
                session.send('Sweet, now let’s do the thing!');
            }
            console.log("CALL: " + Action.label);
            builder.Prompts.choice(session,'Free Time today?',getIntents());
        },
            function (session, results) {
                if (!results.response) {
                    // exhausted attemps and no selection, start over
                    session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
                    return session.endDialog();
                }

                // on error, start over
                session.on('error', function (err) {
                    session.send('Failed with message: %s', err.message);
                    session.endDialog();
                });

                newUser = false;

                // continue on proper dialog
                var selection = results.response.entity;
                switch (selection) {
                    case 'I have an Action':
                        return session.beginDialog('action');
                    case  'I want to do something':
                        return session.beginDialog('involve');
                    case 'Work on an issue':
                        return session.beginDialog('issue');

                }
            }
    ]));
}
else if(!newUser){
    console.log("OLD USER");    
    bot.dialog('/', new builder.IntentDialog()
        .onDefault([
        function (session){
            builder.Prompts.choice(session,'Free Time today?',getIntents());
        },
            function (session, results) {
                if (!results.response) {
                    // exhausted attemps and no selection, start over
                    session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
                    return session.endDialog();
                }

                // on error, start over
                session.on('error', function (err) {
                    session.send('Failed with message: %s', err.message);
                    session.endDialog();
                });

                // continue on proper dialog
                var selection = results.response.entity;
                switch (selection) {
                    case 'I have an Action':
                        return session.beginDialog('action');
                    case  'I want to do something':
                        return session.beginDialog('involve');
                    case 'Work on an issue':
                        return session.beginDialog('issue');

                }
            }
    ]));
}
