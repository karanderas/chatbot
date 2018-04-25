# install following
- node v8+
    - curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
    - sudo apt-get install -y nodejs
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

# refresh when you save
- sudo npm install nodemon -g

# install local web server
- npm install restify --save

# use environment variables
- npm install dotenv --save

# running server and acces with Bot Framework Emulator
- nodemon app.js

# API spaceX
- npm install spacex-api-wrapper --save
- npm install adaptivecards --save