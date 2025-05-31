const Discord = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Discord.Client} client
     */
    run: async (client) => {
        console.log('[BOT] Bot is online');
    }
}