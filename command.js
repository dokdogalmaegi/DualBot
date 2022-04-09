const OAuth = require('./OAuth');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [{
  name: 'ping',
  description: 'Test Ping!'
}];

const rest = new REST({ version: '9' }).setToken(OAuth.token);

(async () => {
  try {
    console.log('Start');

    await rest.put(
      Routes.applicationGuildCommands(OAuth.clientId, OAuth.listOfGuildId.gamePartyGuildId),
      { body: commands },
    );

    console.log('커맨드 만들어졌습니다.');
  } catch (err) {
    console.error(err);
  }
})();
