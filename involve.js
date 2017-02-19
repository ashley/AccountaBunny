var builder = require('botbuilder');

module.exports = {
    Label: 'I want to do something',
    Dialog: [
        // Destination
        function (session) {
            builder.Prompts.text(session, 'How much free time do you have right now?');
        },
        function(session, results){
            session.userData.time = results.response.entity;
            session.send("Here is the action you should do");
        },
                           
    ]
};