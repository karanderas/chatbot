require('dotenv').config(); // récupère les variables d'environnement

var builder = require('botbuilder'); // composant du SDK microsoft bot builder
var restify = require('restify'); // web service basé sur Node.js

// server
var server = restify.createServer(); // création du serveur web
server.listen(process.env.PORT, function() { // attribution du port 3978
    console.log("%s listening to %s", server.name, server.url); 
});

// Connector
var connector = new builder.ChatConnector({
    appId : process.env.MICROSOFT_APP_ID,
    appPassword : process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen()); // connecteur relié à l'url http://localhost:3978/api/messages

var inMemoryStorage = new builder.MemoryBotStorage(); // instanciation d'une mémoire à long terme

// Universal bot
var bot = new builder.UniversalBot(connector, [
    function(session){
        var name = "buddy";
        if(session.userData.profile){
            name = session.userData.profile.name; // si l'utilisateur n'a pas de nom lui dire buddy
        }
        session.send(`Hey ${name}, it's decision time`); // 1ère réponse du bot une fois poké et récupération du nom si il a été saisi
        session.beginDialog('menu'); // appel de la fonction de dialogue nommée menu 
    },
    function(session, results){
        if(!session.userData.profile){
            session.userData.profile = results.response; // on récupère l'information du endDialogueWithResult de la step 2
        }
        session.send(`hello ${session.userData.profile.name} =)`); // on affiche le nom saisi par l'utilisateur
    }
]).set('storage', inMemoryStorage); // attribution de la mémoire à long terme au bot

// tableau clé valeure
// Ici les valeurs du panneau de choix faisant référence à d'autres dialogues
var menuItems ={
    "Ask me a question": {
        item: 'greetings'
    },
    "Blague Toto": {
        item: 'blague'
    },
    "Quitter": {
        item: 'quitter'
    }
}

// affichage du panneau de choix + clique vers le choix du dialogue sélectionné
bot.dialog('menu', [
    function(session){
        builder.Prompts.choice(session, 'Select an option', menuItems, {listStyle: 3}); // 2ème réponse du bot
    },
    function(session, results){
        var choice = results.response.entity;
        var item = menuItems[choice].item;
        session.beginDialog(item);
    }
]);

// Si clique sur Ask me a question exécute le dialogue "greetings"
bot.dialog('greetings', [
    // Step 1
    function(session, results, skip){
        session.dialogData.profile = results || {};
        if(!session.dialogData.profile.name){ // si le nom n'a pas été enregistrer en mémoire alors le bot le demande
            builder.Prompts.text(session, 'What\'s your name ?');
        }else{ // sinon on passe à la step 2
            skip();
        }
    },
    // Step 2
    function(session, results){
        if(results.response){
            session.dialogData.profile.name = results.response; // on récupère le nom que l'utilisateur saisi
        }
        session.endDialogWithResult({ response: session.dialogData.profile }); // on passe l'information de la réponse en quittant le dialogue
    }
]);

// Si clique sur Blague Toto exécute le dialogue "blague"
bot.dialog('blague', [
    function(session, results, skip){
        session.send('- Bonjour Toto<br>- Bonjour mémé.<br>- Si tu me dis combien j\'ai de bonbons dans ma main, je te les donne tous les deux.<br>- Tu en as deux ! - Qui te l\'a dit ?!? ');
        session.endDialog();
    }
]);

// Si clique sur Quitter clôture la discussion et affiche un message
bot.dialog('quitter', [
    function(session){
        var nameAgain = ";)";
        if(session.userData.profile){
            nameAgain = session.userData.profile.name;
        }
        session.endConversation(`See you soon ${nameAgain} !`);
    }
]);