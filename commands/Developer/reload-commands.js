const Discord = require('discord.js');

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.run = async (interaction, client) => {
    try {
        const commandsArray = await require('../../handlers/commands')(client);
        commandsArray.forEach(commandName => {
            const command = client.commands.get(commandName.name);
            delete require.cache[require.resolve(`../${command.data.category}/${command.data.name}.js`)];

            const newCommand = require(`../${command.data.category}/${command.data.name}.js`);
            newCommand.data = command.data;
            client.commands.set(newCommand.data.name, newCommand);
        });

        require('../../handlers/commands').load(client);
        interaction.reply({ embeds: [client.embed(interaction, `✅ Reloaded ${client.commands.size} commands`)], flags: Discord.MessageFlags.Ephemeral });
    } catch (error) {
        interaction.reply({ embeds: [client.embed(interaction, `❌ Failed to reload commands, check console for details.`)], flags: Discord.MessageFlags.Ephemeral });
        console.error(`[SLASH-COMMANDS] Error reloading commands:`, error);
    }
}

module.exports.command = new Discord.SlashCommandBuilder()
    .setName('reload-commands')
    .setDescription('Reload slash commands')