var builder = require('botbuilder');

module.exports = {
    Label: 'I have an Action',
    Dialog: [
        // Destination
        function (session) {
            builder.Prompts.text(session, 'What is your actionable? (exp. come to ____)');
        },
        function(session, results){
            session.userData.title = results.response.entity;
            builder.Prompts.text(session, 'At what time is your actionable? (exp. HH:MM AM/PM, any time)');
        },
        function(session, results){
            session.userData.time = results.response.entity;
            builder.Prompts.text(session, 'Where is your actionable?');
        },
        function(session, results){
            session.userData.location = results.response.entity;
            builder.Prompts.text(session, 'How long will your actionable take?');
        },   
        function(session, results){
            session.userData.duration = results.response.entity;
            session.send('Great, we\’ll let your fellow accountabuddies know!');
        },                    
    ]
};

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};