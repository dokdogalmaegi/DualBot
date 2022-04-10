const OAuth = require('./OAuth');
const { getDice, sleep, getMentionFromUser } = require('./Utils');
const { Client, Intents, ReactionEmoji, MessageReaction } = require('discord.js');
const { time } = require('@discordjs/builders');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on('ready', () => {
  console.log(`I am Ready ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
    
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

  if (interaction.commandName === '카운터') {
    const User = interaction.options.get('컨트롤러');
    if(User.user.bot) {
      await interaction.reply(`오호라... 당신은 일개 로봇 따위도 사람이라고 믿는 추상론자로군요..\n아쉽지만 제 천년의 눈은 피할수 없습니다!?`)
      return;
    }

    const userNameMention = getMentionFromUser(User.user.id);
    const cardName = interaction.options.get('카드명').value;
    let count = interaction.options.get('카운트').value;

    const msg = await interaction.reply({ content: `${userNameMention}님의 \`${cardName}\`의 카운트는 ${count}입니다~`, fetchReply: true });

    try {
      await msg.react('⬆️');
      await msg.react('⬇️');
      await msg.react('⏫');
      await msg.react('⏬');
      await msg.react('❌');

      const filter = reaction => {
        return reaction.emoji.name === '⬆️' || reaction.emoji.name === '⬇️' || reaction.emoji.name === '⏫' || reaction.emoji.name === '⏬' || reaction.emoji.name === '❌';
      }

      const collector = msg.createReactionCollector({filter});

      collector.on('collect', (reaction, user) => {
        if(user.bot) return;

        if (reaction.emoji.name === '⬆️') count++; 
        if (reaction.emoji.name === '⬇️') count--;
        if (reaction.emoji.name === '⏫') count = count + 2;
        if (reaction.emoji.name === '⏬') count = count - 2;
        if (reaction.emoji.name === '❌') {
          collector.stop();
          return;
        }
        reaction.users.remove(user);
        interaction.editReply(`${userNameMention}님의 \`${cardName}\`의 카운트는 ${count}입니다~`);
      });

      collector.on('end', () => {
        interaction.editReply('카운팅이 종료되었습니다.\n감사합니다~!');
      })
    } catch (error) {
      console.error('error: ', error);
    }
  }
});

client.login(OAuth.token);