const { removePlayer } = require('../workers/players');

module.exports = async (msg) => {
  if (msg.mentions.users.size) {
    const taggedUser = msg.mentions.users.first();

    if (msg.author.id === taggedUser.id) {
      try {
        await removePlayer(taggedUser.id, msg.guild.id);
        msg.channel.send('Распидориться решил? Ну и иди на хуй!');
      } catch (error) {
        msg.channel.send(`че то не так пошло ${error}`);
      }
    } else {
      msg.channel.send('Сам распидоривайся, а других не трожь, пидор.');
    }
  } else {
    msg.channel.send('Кого распидоривать будем?');
  }
};
