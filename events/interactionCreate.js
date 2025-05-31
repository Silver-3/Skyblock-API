const Discord = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction
     */
    run: async (interaction, client) => {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.log(error);
            }
            return;
        } else if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                if (command.data.restricted === true && interaction.user.id !== client.config.devId) {
                    return interaction.reply({
                        embeds: [client.embed(interaction, '❌ You aren\'t allowed to use this command.')],
                        flags: Discord.MessageFlags.Ephemeral
                    });
                } else if (command.disabled == true) {
                    return interaction.reply({
                        embeds: [client.embed(interaction, '❌ This command is disabled.')],
                        flags: Discord.MessageFlags.Ephemeral
                    });
                }

                await command.run(interaction, client);
            } catch (error) {
                interaction.reply({
                    content: `Something went wrong\n${error.message}`,
                    flags: Discord.MessageFlags.Ephemeral
                });
                console.error(error);
            }
        } else {
            const conversion = {
                2: 'button',
                3: 'stringSelectMenu',
                5: 'modal'
            }
            const name = interaction.customId?.split('_')[0];
            const command = client.commands.get(name);
            const component = conversion[interaction.componentType || interaction.type];
    
            if (command && component) {
                try {
                    await require(`../commands/${command.data.category}/${name}.js`)[component](interaction, client);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}