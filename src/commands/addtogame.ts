import { Client, Message } from "discord.js";

const { checkPlayer, addPlayer } = require('../workers/players');
const Sentry = require('../helpers/log');

module.exports = async (client: Client, msg: Message) => {
  try {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      const isUserExists: boolean = await checkPlayer(taggedUser?.id, msg.guild?.id);

      if (client.user?.id === taggedUser?.id) {
        await msg.channel.send('Не, я в эту хуйню играть не буду.');
        return;
      }

      if (taggedUser?.bot) {
        await msg.channel.send('Это типа прикол такой?');
        return;
      }

      if (isUserExists) {
        await msg.channel.send('Да он уже в игре.');
      } else {
        try {
          await addPlayer(taggedUser?.id, msg.guild?.id, taggedUser?.username);
          await msg.channel.send('Ну все, теперь он с нами!');
        } catch (error) {
          Sentry.captureException(error);
          console.log('addtogame.js:28 | ', 'error =', error);
          await msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
        }
      }
    } else {
      await msg.channel.send('Кого пидорить-то, идиот?');
    }
  } catch (e) {
    Sentry.captureException(e);
    console.log('addtogame.js:34 | ', 'e =', e);
    await msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
