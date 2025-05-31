const Discord = require('discord.js');
const fs = require('fs');

module.exports.commands = [];

/**
 * 
 * @param {Discord.Client} client
 */

module.exports = async (client) => {
    this.commands = [];

    fs.readdirSync('./commands').forEach(dir => {
        const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));

        for (const commandFile of commandFiles) {
            const file = require(`../commands/${dir}/${commandFile}`);

            file.data = {
                name: file.command.name,
                description: file.command.description,
                category: dir
            };

            if (file.data.category == 'Developer') file.data.restricted = true;

            let usage = `/${file.command.name}`;

            if (file.command ?.options && file.command.options.length > 0) {
                file.command.options.forEach(option => {
                    usage += ` ${option.required ? '<' : '['}${option.name}${option.required ? '>' : ']'}`;
                });
            };

            file.data.usage = usage;

            client.commands.set(file.command.name, file);
            this.commands.push(file.command.toJSON());
        }
    });

    console.log("[INFO] Commands have loaded.");
    return this.commands;
}

/**
 * 
 * @param {Discord.Client} client
 */

module.exports.load = async (client) => {
  const rest = new Discord.REST({ version: '9' });

  if (client instanceof Discord.Client) {
    rest.setToken(client.config.token);

    try {
      await rest.put(
        Discord.Routes.applicationCommands(client.user.id), {
          body: this.commands,
        }
      );
  
      client.guilds.cache.forEach(async (guild) => {
        await rest.put(
          Discord.Routes.applicationGuildCommands(client.user.id, guild.id), {
            body: this.commands,
          }
        );
      });
  
      console.log(`[SLASH-COMMANDS] ${this.commands.length} commands reloaded.`);
    } catch (error) {
      console.log(`[SLASH-COMMANDS] Something went wrong with registering slash commands: ${error.message}\n${error.stack}`)
    }
  } else if (client instanceof Discord.Guild) {
    rest.setToken(client.client.config.token);

    try {
      await rest.put(
        Discord.Routes.applicationGuildCommands(client.client.user.id, client.id), {
          body: this.commands,
        }
      );
  
      console.log(`[SLASH-COMMANDS] ${this.commands.length} commands reloaded.`);
    } catch (error) {
      console.log(`[SLASH-COMMANDS] Something went wrong with registering slash commands: ${error.message}\n${error.stack}`)
    }
  }
};