const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((intent) => {
        return Discord.GatewayIntentBits[intent]
    }),
    partials: Object.keys(Discord.Partials).map((partial) => {
        return Discord.Partials[partial]
    })
});

client.commands = new Discord.Collection();
client.config = config;

["commands", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(config.token);