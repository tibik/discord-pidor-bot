const curses = require('../helpers/curses');
const { getRandomPlayer } = require('../workers/players');
const Sentry = require('../helpers/log');

const SECONDS_TO_REACT = 15;

module.exports = async (msg) => {
  try {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      const curse = curses[Math.floor(Math.random() * curses.length)];

      if (msg.author.id === taggedUser.id) {
        msg.channel.send('Ага, шутник.');
      } else {
        msg.channel.send(`<@${taggedUser.id}> ${curse}`);
      }
    } else {
      const warnMessage = await msg.channel.send(
        `Ты не сказал кого ебать, но можем рандомно кого-нибудь из пидоров. Ставь лойс, если хочешь.`
      );

      const reactions = await warnMessage.awaitReactions(() => {}, {
        time: SECONDS_TO_REACT * 1000,
      });

      if (reactions.count > 0) {
        const player = await getRandomPlayer(msg.guild.id);
        const curse = curses[Math.floor(Math.random() * curses.length)];

        msg.channel.send(`<@${player.discord_user_id}> ${curse}`);
      } else {
        msg.channel.send(`Ну и хуй с тобой, <@${msg.author.id}>!`);
      }
    }
  } catch (e) {
    Sentry.captureException(e);
    msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
