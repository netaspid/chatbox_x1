const tmi = require('tmi.js');
const fetch = require('node-fetch');
const elo = "";

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
  else if (commandName === '!elo') {
    fetchDataFromRiotApi();
    client.say(target, elo)
    console.log(`* Executed ${commandName} command`);
  }
}

function overwriteElo(eloNew) {
  elo = eloNew;
}

function getAccounts() {
  return "https://euw.op.gg/summoner/userName=PearlcXrVi \r\n https://euw.op.gg/summoner/userName=aspidlip \r\n  https://euw.op.gg/summoner/userName=dorogavmt200pt";
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

function fetchDataFromRiotApi(){
   fetch('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/i1Uep2SH6PiEhh33T5mXj4BJImgIA0pf6vXIgROYk2P0i3k?api_key=RGAPI-44886ab5-4ddc-4e1e-b703-daf934eeb0e9')
    .then(response =>response.json())
    .then(json => {
      console.log(json);
      overwriteElo(json[0].tier + ' ' + json[0].rank);
    });
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

//test3