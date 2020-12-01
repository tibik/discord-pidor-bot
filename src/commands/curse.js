const curses = require('../helpers/curses');

module.exports = async (msg) => {
  if (msg.mentions.users.size) {
    const taggedUser = msg.mentions.users.first();
    const curse = curses[Math.floor(Math.random() * curses.length)];

    if (msg.author.id === taggedUser.id) {
      msg.channel.send('Ага, шутник.');
    } else {
      msg.channel.send(`<@${taggedUser.id}> ${curse}`);
    }
  } else {
    msg.channel.send('Кого ебать собрался?');
  }
};
