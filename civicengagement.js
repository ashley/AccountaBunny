var builder = require('botbuilder');

module.exports = {
    Label: 'Call to Action',
    Dialog: [
        // Destination
        function (session) {
            builder.Prompts.text(session, 'Have time for some ~civic engagment~ today?');
        },
        function(session, results){
            if(results.response == "yes"){
                session.send("Here is the suggested action");
            }
            else if (results.response == "no"){
                session.send("**unimpressed accountabunny** Hmm well maybe the world will just fix itself");
            }
        }                      
    ]
};