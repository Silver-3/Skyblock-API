const Discord = require('discord.js');
const skyblockAPI = require('../../skyblock-api/index.js');

/**
 * 
 * @param {Number} amount
 * @returns {String}
 */

function formatNumber (amount) {
    if (amount >= 1_000_000_000) {
        return (amountnum / 1_000_000_000).toFixed(2) + 'b';
    } else if (amount >= 1_000_000) {
        return (amount / 1_000_000).toFixed(2) + 'm';
    } else if (amount >= 1_000) {
        return (amount / 1_000).toFixed(2) + 'k';
    } else {
        return amount.toFixed(0);
    }
}

/**
 * 
 * @param {Discord.AutocompleteInteraction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.autocomplete = async (interaction, client) => {
    const api = new skyblockAPI(client.config.apiKey);
    const username = interaction.options.getString('username');
    if (!username) return interaction.respond([]);

    let allProfiles;
    try {
        allProfiles = await api.getPlayerProfiles(username);
    } catch (error) {
        return interaction.respond([]);
    }

    const focusedValue = interaction.options.getFocused().toLowerCase();
    const choices = allProfiles.map(profile => ({ name: profile.name, value: profile.id }));
    const filtered = choices.filter(choice => choice.name.toLowerCase().includes(focusedValue)).slice(0, 25);

    await interaction.respond(filtered);
}

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.run = async (interaction, client) => {
    const username = interaction.options.getString('username');
    const profile = interaction.options.getString('profile');

    const api = new skyblockAPI(client.config.apiKey);
    const data = await api.getPlayerProfile(username, profile);
    
    interaction.reply(`${username} has ${formatNumber(data.currencies.coin_purse)} in their purse`);
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName('view-player')
    .setDescription('View a player')
    .addStringOption(option => option
        .setName('username')
        .setDescription('Username of user')
        .setRequired(true))
    .addStringOption(option => option
        .setName('profile')
        .setDescription('Profile name to use')
        .setAutocomplete(true)
        .setRequired(true))