const { checkPlayer, addPlayer } = require('../workers/players');

module.exports = async (msg) => {
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
};
