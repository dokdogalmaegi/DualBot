const OAuth = require('./OAuth');
const User = require('./User');
const { getDice, sleep, getMentionFromUser } = require('./Utils');
const { Client, Intents, ReactionEmoji, MessageReaction, MessageEmbed, Message } = require('discord.js');
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
    const coinImgPath = coin === '앞면' ? 'https://cdn.discordapp.com/attachments/825167632147415101/963095627582013451/2_.png' : 'https://cdn.discordapp.com/attachments/825167632147415101/963095040484311050/pngwing.com_.png';

    const coinEmbed = new MessageEmbed()
        .setTitle(`코인토스의 결과는 ${coin}입니다!`)
        .setImage(coinImgPath);
    await interaction.editReply({ embeds: [coinEmbed] });
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
    const Controller = interaction.options.get('컨트롤러');
    if(Controller.user.bot) {
      await interaction.reply(`오호라... 당신은 일개 로봇 따위도 사람이라고 믿는 추상론자로군요..\n아쉽지만 제 천년의 눈은 피할수 없습니다!?`)
      return;
    }

    const userNameMention = getMentionFromUser(Controller.user.id);
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
      });
    } catch (error) {
      console.error('error: ', error);
    }
  }

  if(interaction.commandName === '듀얼') {
    const opponentDiscordUser = interaction.options.get('상대');
    const currentDiscordUser = interaction.user;

    if (opponentDiscordUser.user.bot) {
      if(opponentDiscordUser.user.id === '962354269313450084') {
        interaction.reply(`호호.. ${getMentionFromUser(currentDiscordUser.id)} 당신 따위가 저 페가수스의 상대가 될 수 있다고 생각하나요!?\n정말 머저리같은 생각이군요.. 아쉽게도 전 상대가 될 수 없습니다!`)
        return;
      }

      interaction.reply(`호호.. ${getMentionFromUser(currentDiscordUser.id)} 당신은 로봇 따위와 싸우려는 쫄.보 랄까요!?`)
      return;
    }

    if (currentDiscordUser.id === opponentDiscordUser.user.id) {
      interaction.reply(`호호.. ${getMentionFromUser(currentDiscordUser.id)} 당신... 친구가 없는 건가요?\n혼자서 듀얼하는건 뭔 머저리 같은 생각이시죠?`);
      return;
    }

    const currentUser = new User(currentDiscordUser.username, currentDiscordUser.id);
    const opponentUser = new User(opponentDiscordUser.user.username, opponentDiscordUser.user.id);

    const initEmbed = new MessageEmbed()
        .setTitle(`${currentUser.userName} VS ${opponentUser.userName}`)
        .addFields(
          { name: `${currentUser.userName}`, value: `${currentUser.lifePoint}`, inline: true },
          { name: `${opponentUser.userName}`, value: `${opponentUser.lifePoint}`, inline: true },
        )

    const msg = await interaction.reply({ embeds: [initEmbed], fetchReply: true });

    let dualUsers = {};

    dualUsers[currentUser.userName] = currentUser;
    dualUsers[opponentUser.userName] = opponentUser;

    try {
      await msg.react('1️⃣');
      await msg.react('⬆️');
      await msg.react('⬇️');
      const divisionEmoji = client.emojis.cache.find(emoji => emoji.name === 'sample');
      await msg.react(divisionEmoji);
      await msg.react('2️⃣');
      await msg.react('🏳️');

      const filter = reaction => {
        return reaction.emoji.name === '1️⃣' || reaction.emoji.name === '⬆️' || reaction.emoji.name === '⬇️' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '🏳️' || reaction.emoji.name === 'sample';
      }

      const collector = msg.createReactionCollector({filter});

      let surrenderUser = '';
      let defeatUser = '';
      let handleUserName = currentUser.userName;

      collector.on('collect', (reaction, user) => {
        if(user.bot) return;

        if (reaction.emoji.name === '1️⃣') {
          handleUserName = currentUser.userName;
        }
        if (reaction.emoji.name === '2️⃣') {
          handleUserName = opponentUser.userName;
        }

        if (reaction.emoji.name === '⬆️') {
          interaction.channel.awaitMessages({ max: 1, time: 10000 })
                .then(collected => {
                  dualUsers[handleUserName].plusLifePoint(Number(collected.first().content));

                  const editEmbed = new MessageEmbed()
                      .setTitle(`${currentUser.userName} VS ${opponentUser.userName}`)
                      .addFields(
                        { name: `${currentUser.userName}`, value: `${currentUser.lifePoint}`, inline: true },
                        { name: `${opponentUser.userName}`, value: `${opponentUser.lifePoint}`, inline: true },
                      )
                  interaction.editReply({ embeds: [editEmbed] });

                  collected.first().delete();
                })
                .catch(collected => {
                  console.error(`error: ${collected}!`);
                });
        } 
        if (reaction.emoji.name === '⬇️') {
          interaction.channel.awaitMessages({ max: 1, time: 10000 })
                .then(collected => {
                  dualUsers[handleUserName].minusLifePoint(Number(collected.first().content));

                  const editEmbed = new MessageEmbed()
                      .setTitle(`${currentUser.userName} VS ${opponentUser.userName}`)
                      .addFields(
                        { name: `${currentUser.userName}`, value: `${currentUser.lifePoint}`, inline: true },
                        { name: `${opponentUser.userName}`, value: `${opponentUser.lifePoint}`, inline: true },
                      );
                      
                  interaction.editReply({ embeds: [editEmbed] });

                  collected.first().delete();

                  if (dualUsers[handleUserName].lifePoint === 0) {
                    defeatUser = dualUsers[handleUserName].userName;
                    collector.stop();
                    return;
                  }
                })
                .catch(collected => {
                  console.error(`error: ${collected}!`);
                });
        }
        if (reaction.emoji.name === 'sample') {
          dualUsers[handleUserName].divisionLifePoint(2);

          const editEmbed = new MessageEmbed()
              .setTitle(`${currentUser.userName} VS ${opponentUser.userName}`)
              .addFields(
                { name: `${currentUser.userName}`, value: `${currentUser.lifePoint}`, inline: true },
                { name: `${opponentUser.userName}`, value: `${opponentUser.lifePoint}`, inline: true },
              );
              
          interaction.editReply({ embeds: [editEmbed] });
        }
        if (reaction.emoji.name === '🏳️' && (user.id === currentUser.userId || user.id === opponentUser.userId)) {
          surrenderUser = user.username;
          collector.stop();
          return;
        }
        
        reaction.users.remove(user);
      });

      collector.on('end', collected => {
        let resultMessage = ''
        let victoryUser = '';

        if(currentUser.userName === defeatUser) victoryUser = opponentUser.userName;
        else victoryUser = currentUser.userName;

        resultMessage = surrenderUser ? `${surrenderUser}님께서 항복을 선언했습니다~!` : `${victoryUser}군의 승리입니다~!`

        interaction.channel.bulkDelete(100)
            .then(() => {
              const editEmbed = new MessageEmbed()
                  .setTitle(resultMessage)
                  .addField(`승리: ${victoryUser}`, `패배: ${defeatUser}`, true)
                  .setImage('https://i.ytimg.com/vi/AsVS1UjGzo0/mqdefault.jpg');
              interaction.channel.send({ embeds: [editEmbed] });
            });
      });
    } catch(err) {
      console.error('error: ', err);
    }
  }
});

client.login(OAuth.token);