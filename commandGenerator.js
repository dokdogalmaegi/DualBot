const OAuth = require('./OAuth');
const CustomCommand = require('./CustomCommand');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const diceBuilder = new SlashCommandBuilder()
      .setName('주사위')
      .setDescription('주사위를 입력받습니다. 기본 범위: 1~6')
      .addNumberOption(option => option.setName('range').setDescription('주사위 범위'));

const diceCommand = new CustomCommand(diceBuilder);

const coinBuilder = new SlashCommandBuilder()
      .setName('코인토스')
      .setDescription('코인을 던짐.');

const coinCommand = new CustomCommand(coinBuilder);

const commands = [diceCommand.command, coinCommand.command];

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
