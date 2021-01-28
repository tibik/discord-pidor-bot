const { removePlayer } = require('../workers/players');
const Sentry = require('../helpers/log');

module.exports = async (msg) => {
  try {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();

      if (msg.author.id === taggedUser.id) {
        try {
          await removePlayer(taggedUser.id, msg.guild.id);
          msg.channel.send('Распидориться решил? Ну и иди на хуй!');
        } catch (error) {
          Sentry.captureException(error);
          console.log('kickfromgame.js:15 | ', 'error =', error);
          msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
        }
      } else {
        msg.channel.send('Сам распидоривайся, а других не трожь, пидор.');
      }
    } else {
      msg.channel.send('Кого распидоривать будем?');
    }
  } catch (e) {
    Sentry.captureException(e);
    console.log('kickfromgame.js:23 | ', 'e =', e);
    msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
