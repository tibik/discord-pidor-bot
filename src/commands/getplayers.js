const { getPlayers } = require('../workers/players');
const Sentry = require('../helpers/log');

module.exports = async (msg) => {
  try {
    const stats = await getPlayers(msg.guild.id);
    msg.channel.send(stats);
  } catch (error) {
    Sentry.captureException(error);
    console.log('getplayers.js:10 | ', 'error =', error);
    msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
