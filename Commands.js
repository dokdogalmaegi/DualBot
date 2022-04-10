const CustomCommand = require('./CustomCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');

const diceBuilder = new SlashCommandBuilder()
      .setName('주사위')
      .setDescription('주사위를 입력받습니다. 기본 범위: 1~6')
      .addNumberOption(option => option.setName('range').setDescription('주사위 범위'));

const coinBuilder = new SlashCommandBuilder()
      .setName('코인토스')
      .setDescription('코인을 던짐.');

const countBuilder = new SlashCommandBuilder()
      .setName('카운터')
      .setDescription('카운터를 계산합니다.')
      .addUserOption(userOption => userOption.setName('컨트롤러').setDescription('카드의 주인을 입력합니다.').setRequired(true))
      .addStringOption(stringOption => stringOption.setName('카드명').setDescription('카드명을 입력합니다.').setRequired(true))
      .addNumberOption(countOption => countOption.setName('카운트').setDescription('카운트를 입력받습니다.').setRequired(true));

const commandBuilders = [
  diceBuilder,
  coinBuilder,
  countBuilder,
];

const commands = commandBuilders.map(builder => new CustomCommand(builder).command);

module.exports = commands;