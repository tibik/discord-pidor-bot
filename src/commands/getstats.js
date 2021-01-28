const { getStatistics } = require('../workers/games');
const Sentry = require('../helpers/log');

module.exports = async (msg) => {
  try {
    const stats = await getStatistics(msg.guild.id);
    msg.channel.send(stats);
  } catch (error) {
    Sentry.captureException(error);
    console.log('getstats.js:10 | ', 'error =', error);
    msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
