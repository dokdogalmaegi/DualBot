const OAuth = require('./OAuth');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`I am Ready ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
    
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(OAuth.token);