const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: "aspid_bot",
    password: "oauth:5n60hrlqyfaib6g1cdond134omz23p"
  },
  channels: [
    "netaspid"
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `@${context.username}, Вы бросили кости, у вас : ${num} `);
    console.log(`* Executed ${commandName} command`);
  } 
  else if (commandName === '!accs') {
    let accounts = getAccounts();
    client.say(target, accounts);
    console.log(`* Executed ${commandName} command`);
  }
  else {
    console.log(`* Unknown command ${commandName}`);
  }
}

function getAccounts() {
  return "https://euw.op.gg/summoner/userName=PearlcXrVi \r\n https://euw.op.gg/summoner/userName=aspidlip \r\n  https://euw.op.gg/summoner/userName=dorogavmt200pt";
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}