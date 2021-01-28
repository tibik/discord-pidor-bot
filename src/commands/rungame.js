const relativeTime = require('dayjs/plugin/relativeTime');
const dayjs = require('dayjs');
const { canStartGame, tease } = require('../play');
const { saveGame, getLastGame } = require('../workers/games');
const { updatePlayerScore, getRandomPlayer } = require('../workers/players');
const { getRandomElement } = require('../helpers/index');
const Sentry = require('../helpers/log');

require('dayjs/locale/ru');

dayjs.locale('ru');
dayjs.extend(relativeTime);

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
  try {
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
      const lastGameDate = dayjs(lastGame.datetime * 1000);
      const nextGameDate = dayjs(lastGameDate).add(1, 'day');
      const currentDate = dayjs();
      msg.channel.send(`А пидор сегодня - ${lastGame.discord_user_name}, следующая игра ${currentDate.to(nextGameDate)}.`);
    }
  } catch (e) {
    Sentry.captureException(e);
    console.log('rungame.js:49 | ', 'e =', e);
    msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
