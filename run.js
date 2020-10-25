require('dotenv').config();
const DiscordJS = require('discord.js');
const { Client } = require('pg');
const ChatFunctions = require('./src/ChatFunctions');
const GamesRepository = require('./src/Repositories/GamesRepository');
const ParticipantRepository = require('./src/Repositories/ParticipantRepository');
const Game = require('./src/Game');
const DbAdapter = require('./src/DbAdapter');

const DiscordClient = new DiscordJS.Client();

const connectionString = process.env.NODE_ENV === 'development' ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;
const client = new Client({ connectionString });

const dbAdapter = new DbAdapter(client);
dbAdapter.connect();

const gamesRepository = new GamesRepository(dbAdapter);
const participantsRepository = new ParticipantRepository(dbAdapter);
const game = new Game(dbAdapter, participantsRepository, gamesRepository);

const gayWords = /гей|пидор|геюга|пидорас|педик|gay/i;

DiscordClient.on('message', (msg) => {
  if (msg.content.startsWith('!пидордня') || msg.content.startsWith('!пидорня')) {
    participantsRepository.IsParticipantExists(msg.author.id, msg.guild.id).then((isExists) => {
      if (isExists) {
        msg.channel.send("You're already participating in this game, silly");
      } else {
        participantsRepository.AddParticipant(msg.author.id, msg.guild.id, ChatFunctions.getNickname(msg));
        msg.channel.send(`Alright, you're in, ${ChatFunctions.getNickname(msg)}`);
      }
    });
  } else if (msg.content.startsWith('!ктопидор')) {
    game.CanStartGame(msg.guild.id).then(
      () => {
        game.Run(msg.guild.id).then(
          async (winMsg) => {
            await game.Tease(msg.channel).then();
            msg.channel.send(winMsg);
          },
          (reject) => {
            msg.channel.send(reject);
          }
        );
      },
      (reject) => {
        msg.channel.send(`А пидор сегодня - ${reject}`);
      }
    );
  } else if (msg.content.startsWith('!топпидоров')) {
    game.GetStats(msg.guild.id).then((message) => {
      msg.channel.send(message);
    });
  } else if (msg.content.startsWith('!исключить')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();

      if (msg.author.id === taggedUser.id) {
        msg.channel.send('Распидориться решил? Ну и иди на хуй!');
        participantsRepository.RemoveParticipant(taggedUser.id, msg.guild.id);
      } else {
        msg.channel.send('Сам распидоривайся, а других не трожь, пидор.');
      }
    } else {
      msg.channel.send('Кого распидоривать будем?');
    }
  } else if (msg.content.startsWith('!пидорнуть')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      participantsRepository.IsParticipantExists(taggedUser.id, msg.guild.id).then((isExists) => {
        if (isExists) {
          msg.channel.send('Да он уже в игре.');
        } else {
          participantsRepository.AddParticipant(taggedUser.id, msg.guild.id, taggedUser.username);
          msg.channel.send('Ну все, теперь он с нами!');
        }
      });
    } else {
      msg.channel.send('Кого пидорить-то, идиот?');
    }
  } else if (!msg.author.bot && msg.content.match(gayWords)) {
    msg.react('🏳️‍🌈');
  }
});

// eslint-disable-next-line
DiscordClient.login(process.env.BOT_TOKEN).then(() => console.log('The bot has started!'));
