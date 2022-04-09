const OAuth = require('./OAuth');
const { getDice, sleep } = require('./Utils');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on('ready', () => {
  console.log(`I am Ready ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
    
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === '코인토스') {
    await interaction.reply(`https://i.pinimg.com/originals/52/91/f5/5291f56897d748b1ca0a10c90023588d.gif`);

    await sleep(2000);

    const coin = (Math.floor(Math.random() * 2)) ? '앞면' : '뒷면';
    await interaction.editReply(`코인토스의 결과는 ${coin}입니다!\nhttps://static.dw.com/image/52116971_303.jpg`);
  }

  if (interaction.commandName === '주사위') {
    const max = interaction.options.get('range') ? interaction.options.get('range').value : 6;
    const userName = interaction.user.username;

    if(max <= 1) {
      await interaction.reply(`${userName}의 주사위는 주작입니다!\n어디서 범위를 ${max}로 지정하시죠!? 정말 면상부터 알 수 있는 실력이군요..`);
    } else {
      await interaction.reply(`${userName}의 주사위는 ${getDice(max)}입니다!\n참고로 범위는 1 ~ ${max}라고요!?`);
    }
  }
});

client.login(OAuth.token);