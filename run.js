require('dotenv').config();
const DiscordJS = require('discord.js');

const DiscordClient = new DiscordJS.Client();
const { Client } = require('pg');
const ChatFunctions = require('./src/ChatFunctions');
const GamesRepository = require('./src/Repositories/GamesRepository');
const ParticipantRepository = require('./src/Repositories/ParticipantRepository');
const Game = require('./src/Game');
const DbAdapter = require('./src/DbAdapter');

const connectionString = process.env.NODE_ENV === 'development' ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

// const db = new sqlite3.Database('database.db3');
const dbAdapter = new DbAdapter(client);
dbAdapter.connect();
const gamesRepository = new GamesRepository(dbAdapter);
const participantsRepository = new ParticipantRepository(dbAdapter);
const game = new Game(dbAdapter, participantsRepository, gamesRepository);

DiscordClient.on('message', (msg) => {
  if (msg.content.match(/^!пидордня/) || msg.content.match(/^!пидорня/)) {
    participantsRepository.IsParticipantExists(msg.author.id, msg.guild.id).then((isExists) => {
      if (isExists) {
        ChatFunctions.temporaryMessage(msg.channel, "You're already participating in this game, silly", 7000);
      } else {
        participantsRepository.AddParticipant(msg.author.id, msg.guild.id, ChatFunctions.getNickname(msg));
        ChatFunctions.temporaryMessage(msg.channel, `Alright, you're in, ${ChatFunctions.getNickname(msg)}`, 5000);
      }
    });

    ChatFunctions.deleteMessage(msg, 2000);
    return;
  }

  if (msg.content.match(/^!ктопидор/)) {
    game.CanStartGame(msg.guild.id).then(
      () => {
        game.Run(msg.guild.id).then(
          async (winMsg) => {
            await game.Tease(msg.channel).then();
            msg.channel.send(winMsg);
          },
          (reject) => {
            ChatFunctions.temporaryMessage(msg.channel, reject, 8000);
          }
        );
      },
      (reject) => {
        msg.channel.send(`А пидор сегодня - ${reject}`);
      }
    );

    ChatFunctions.deleteMessage(msg, 1000);
  }

  if (msg.content.match(/^!топпидоров/)) {
    game.GetStats(msg.guild.id).then((message) => {
      ChatFunctions.temporaryMessage(msg.channel, message, 15000);
    });
    ChatFunctions.deleteMessage(msg, 1000);
    return;
  }

  if (msg.content.match(/^!исключить/)) {
    const chunks = msg.content.split(' ');
    const userName = chunks[1];
    const userId = msg.guild.members.find((m) => m.user.username === userName).user.id;

    if (!msg.member.hasPermission('ADMINISTRATOR')) {
      ChatFunctions.temporaryMessage(msg.channel, 'Вы кто такой? Я вас не звал. Идите нахуй!', 3000);
    } else {
      ChatFunctions.temporaryMessage(msg.channel, 'Пидарнул пидорка нахуй', 3000);
      participantsRepository.RemoveParticipant(userId, msg.guild.id);
    }
    return;
  }

  if (msg.content.match(/^!пидорнуть/)) {
    const chunks = msg.content.split(' ');
    const userName = chunks[1];
    const userId = msg.guild.members.find((m) => m.user.username === userName).user.id;

    if (!msg.member.hasPermission('ADMINISTRATOR')) {
      ChatFunctions.temporaryMessage(msg.channel, 'Вы кто такой? Я вас не звал. Идите нахуй!', 3000);
    } else {
      ChatFunctions.temporaryMessage(msg.channel, `${userName} добавлен в игру`, 3000);
      participantsRepository.AddParticipant(userId, msg.guild.id, userName);
    }
  }

  const gayWords = /гей|пидор|геюга|пидорас|педик/i;

  if (msg.content.match(gayWords)) {
    msg.react('🏳️‍🌈');
  }
});

// eslint-disable-next-line
DiscordClient.login(process.env.BOT_TOKEN).then(() => console.log('The bot has started!'));
