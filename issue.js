var builder = require('botbuilder');

module.exports = {
    Label: 'Work on an issue',
    Dialog: [
        // Destination 

        function (session){
            builder.Prompts.choice(session,'Let’s work on ISSUE today',["Do, Call, Email"]);
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
                case 'Do':
                    session.sender('One of your friendly neighborhood accountabuddies suggested that you CALL_TO_ACTION at TIME_OF_ACTION at PLACE_OF_ACTION');
                    //builder.Prompts.text(session, 'Would you like to add this to your calendar?');
                case 'Call':
                    session.sender('Calling your TYPE_OF_REP  NAME_OF_REP would be a great way to let them know how you feel about this issue. You can reach their office at PHONE_NUMBER before 6 PM today.');                
                case 'Email':
                    session.sender('Emailing your  TYPE_OF_REP  NAME_OF_REP would be a great way to let them know how you feel about this issue.  You can reach their office at EMAIL before 6 PM today.');
            }
        }                   
    ]
};