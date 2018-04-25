# install following
- node
- vs code (extension: TSLint, DOTEnv, VS code icons)

# download bot emulator: 
- https://github.com/Microsoft/BotFramework-Emulator/releases/download/v3.5.35/botframework-emulator-3.5.35-x86_64.AppImage

# command in current repository
- npm init
- npm install botbuilder --save

# create file and add content
- app.js
- var builder = require('botbuilder');
  var connector = new builder.ConsoleConnector().listen();
  var bot = new builder.UniversalBot(connector, function(session){
      session.send("You said %s", session.message.text);
  });

# start bot and test him
- node app.js

# command
- sudo npm install nodemon -g