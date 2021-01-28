const { checkPlayer, addPlayer } = require('../workers/players');
const Sentry = require('../helpers/log');

module.exports = async (msg) => {
  try {
    const isUserExists = await checkPlayer(msg.author.id, msg.guild.id);
    if (isUserExists) {
      msg.channel.send("You're already participating in this game, silly");
    } else {
      try {
        await addPlayer(msg.author.id, msg.guild.id, msg.author.username);
        msg.channel.send('Ну все, теперь он с нами!');
      } catch (error) {
        msg.channel.send(`че то не так пошло ${error}`);
      }
    }
  } catch (e) {
    Sentry.captureException(e);
    console.log('entergame.js:19 | ', 'e =', e);
    msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
