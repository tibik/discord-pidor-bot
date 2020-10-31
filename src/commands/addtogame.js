const { checkPlayer, addPlayer } = require('../workers/players');

module.exports = async (client, msg) => {
  if (msg.mentions.users.size) {
    const taggedUser = msg.mentions.users.first();
    const isUserExists = await checkPlayer(taggedUser.id, msg.guild.id);

    if (client.user.id === taggedUser.id) {
      msg.channel.send('Не, я в эту хуйню играть не буду.');
      return;
    }

    if (taggedUser.bot) {
      msg.channel.send('Это типа прикол такой?');
      return;
    }

    if (isUserExists) {
      msg.channel.send('Да он уже в игре.');
    } else {
      try {
        await addPlayer(taggedUser.id, msg.guild.id, taggedUser.username);
        msg.channel.send('Ну все, теперь он с нами!');
      } catch (error) {
        msg.channel.send(`че то не так пошло ${error}`);
      }
    }
  } else {
    msg.channel.send('Кого пидорить-то, идиот?');
  }
};
