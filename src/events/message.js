const getStatistics = require('../commands/getstats');
const enterGame = require('../commands/entergame');
const rungame = require('../commands/rungame');
const kickfromgame = require('../commands/kickfromgame');
const addtogame = require('../commands/addtogame');
const getplayers = require('../commands/getplayers');
const playsound = require('../commands/playsound');

const gayWords = /гей|пидор|геюга|пидорас|педик|gay/i;

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!пидордня') || message.content.startsWith('!пидорня')) {
    enterGame(message);
  } else if (message.content.startsWith('!ктопидор')) {
    rungame(message);
  } else if (message.content.startsWith('!топпидоров')) {
    getStatistics(message);
  } else if (message.content.startsWith('!исключить')) {
    kickfromgame(message);
  } else if (message.content.startsWith('!пидорнуть')) {
    addtogame(message);
  } else if (message.content.startsWith('!пидоры')) {
    getplayers(message);
  } else if (!message.author.bot && message.content.match(gayWords)) {
    message.react('🏳️‍🌈');
  } else if (message.content.startsWith('!play')) {
    playsound(message);
  }
};
