const Discord = require('discord.js');

module.exports = {
    name: 'guildCreate',
    once: false,
    /**
     * @param {Discord.Guild} guild
     * @param {Discord.Client} client
     */
    run: async (guild, client) => {
        require('../handlers/commands.js').load(guild);
        console.log(`[EVENT] Added to ${guild.name}, reloading slash commands.`);
    }
}