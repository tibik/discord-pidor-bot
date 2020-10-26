const { getStatistics } = require('../workers/games');

module.exports = async (msg) => {
  try {
    const stats = await getStatistics(msg.guild.id);
    msg.channel.send(stats);
  } catch (error) {
    msg.channel.send(`че то не так пошло ${error}`);
  }
};
