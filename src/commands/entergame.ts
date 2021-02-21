import { Message } from "discord.js";

const { checkPlayer, addPlayer } = require('../workers/players');
const Sentry = require('../helpers/log');

module.exports = async (msg: Message) => {
  try {
    const isUserExists = await checkPlayer(msg.author.id, msg.guild?.id);
    if (isUserExists) {
      await msg.channel.send("You're already participating in this game, silly");
    } else {
      try {
        await addPlayer(msg.author.id, msg.guild?.id, msg.author.username);
        await msg.channel.send('Ну все, теперь он с нами!');
      } catch (error) {
        Sentry.captureException(error);
        console.log('entergame.js:15 | ', 'error =', error);
        await msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
      }
    }
  } catch (e) {
    Sentry.captureException(e);
    console.log('entergame.js:19 | ', 'e =', e);
    await msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
