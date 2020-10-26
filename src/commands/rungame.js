const { canStartGame, tease } = require('../play');
const { saveGame, getLastGame } = require('../workers/games');
const { updatePlayerScore, getRandomPlayer } = require('../workers/players');
const { getRandomElement } = require('../helpers/index');

const resultPhrases = [
  'А вот и пидор - ',
  'Вот ты и пидор, ',
  'Ну ты и пидор, ',
  'Сегодня ты пидор, ',
  'Анализ завершен, сегодня ты пидор, ',
  'ВЖУХ И ТЫ ПИДОР, ',
  'Пидор дня обыкновенный, 1шт. - ',
  'Стоять! Не двигаться! Вы объявлены пидором дня, ',
  'И прекрасный человек дня сегодня... а нет, ошибка, всего-лишь пидор - ',
];

module.exports = async (msg) => {
  const isCan = await canStartGame(msg.guild.id);
  if (isCan) {
    const winner = await getRandomPlayer(msg.guild.id);

    if (!winner) {
      msg.channel.send('А играться-то не с кем.');
      return;
    }
    await saveGame(msg.guild.id, winner.id);
    await updatePlayerScore(winner.id);
    await tease(msg.channel);
    msg.channel.send(`${getRandomElement(resultPhrases)}<@${winner.discord_user_id}>`);
  } else {
    const lastGame = await getLastGame(msg.guild.id);
    msg.channel.send(`А пидор сегодня - ${lastGame.discord_user_name}`);
  }
};
