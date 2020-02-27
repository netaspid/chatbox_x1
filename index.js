const tmi = require('tmi.js');
const fetch = require('node-fetch');

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
client.on("join", onJoin);

// Connect to Twitch:
client.connect();

function onJoin (channel, username, self) {
  client.action( username + " , приветствую тебя дружище!");
}

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
    fetchDataFromRiotApi().then(elo => {
      eloRank = `@${context.username}, netaspid's main account rank now is: ` + elo[0].tier + ' ' + elo[0].rank;
      client.say(target, eloRank);
      console.log(`* Executed ${commandName} command`);
    });
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

async function fetchDataFromRiotApi(){
   let response = await fetch('https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/i1Uep2SH6PiEhh33T5mXj4BJImgIA0pf6vXIgROYk2P0i3k?api_key=RGAPI-44886ab5-4ddc-4e1e-b703-daf934eeb0e9');
   return response.json();

}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
