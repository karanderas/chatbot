require('dotenv').config();

var builder = require('botbuilder');
var restify = require('restify');

// server
var server = restify.createServer();
server.listen(process.env.PORT, function() {
    console.log("%s listening to %s", server.name, server.url);
});

// Connector
var connector = new builder.ChatConnector({
    appId : process.env.MICROSOFT_APP_ID,
    appPassword : process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

// Universal bot
var bot = new builder.UniversalBot(connector, [
    function(session){
        session.send("Hey");
        
        //session.beginDialog('greetings', session.userData.profile);
        session.beginDialog('menu');
    },
    function(session, results){
        if(!session.userData.profile){
            session.userData.profile = results.response;
        }
        session.send(`hello ${session.userData.profile.name} :-)`);
    }
]).set('storage', inMemoryStorage);
var menuItems ={
    "toto": {
        item: 'dialog1'
    },
    "tata": {
        item: 'dialog2'
    },
    "titi": {
        item: 'dialog3'
    }
}
bot.dialog('menu', [
    function(session){
        builder.Prompts.choice(session, 'select an option', menuItems, {listStyle: 3});
    },
    
    function(session, results){
        var choice = results.response.entity;
        var item = menuItems[choice].item;
        session.beginDialog(item);
    }
]);

bot.dialog('getCompanyInfo', [
    function(session){
        session.send('You are inside dialog1');
    }
]);

bot.dialog('dialog2', [
    function(session){
        session.send('You are inside dialog2');
    }
]);

bot.dialog('dialog3', [
    function(session){
        session.send('You are inside dialog3');
    }
]);

bot.dialog('greetings', [
    // Step 1
    function(session, results, skip){
        session.dialogData.profile = results || {};
        if(!session.dialogData.profile.name){
            builder.Prompts.text(session, 'what\'s your name ?');
        }else{
            skip();
        }
    },
    // Step 2
    function(session, results){
        if(results.response){
            session.dialogData.profile.name = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);