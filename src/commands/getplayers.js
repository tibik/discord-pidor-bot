const { getPlayers } = require('../workers/players');

module.exports = async (msg) => {
  try {
    const stats = await getPlayers(msg.guild.id);
    msg.channel.send(stats);
  } catch (error) {
    msg.channel.send(`че то не так пошло ${error}`);
  }
};
