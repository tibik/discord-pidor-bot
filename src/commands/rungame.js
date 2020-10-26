// const { canStartGame, tease } = require('../game.js');
const { saveGame, getLastGame } = require('../workers/games');
const { updatePlayerScore, getRandomPlayer } = require('../workers/players');
const { getRandomElement, asyncForEach, sleep } = require('../helpers/index');

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

const SECS_IN_HOUR = 86400;

const teasePhrases = [
  ["Woob-woob, that's da sound of da pidor-police!", 'Выезжаю на место...', 'Но кто же он?'],
  ["Woob-woob, that's da sound of da pidor-police!", 'Ведётся поиск в базе данных', 'Ведётся захват подозреваемого...'],
  ['Что тут у нас?', 'А могли бы на работе делом заниматься...', 'Проверяю данные...'],
  ['Инициирую поиск пидора дня...', 'Машины выехали', 'Так-так, что же тут у нас...'],
  ['Что тут у нас?', 'Военный спутник запущен, коды доступа внутри...', 'Не может быть!'],
];

async function canStartGame(guild_id) {
  const lastGame = await getLastGame(guild_id);
  const date = Math.floor(Date.now() / 1000) - SECS_IN_HOUR;

  if (!lastGame) {
    return true;
  }
  if (lastGame && lastGame.datetime < date) {
    return true;
  }
  return false;
}

async function tease(channel) {
  const phrases = getRandomElement(teasePhrases);
  await asyncForEach(phrases, async (p) => {
    await sleep(2500 + Math.random() * 5500).then(() => {
      channel.send(p);
    });
  });
  await sleep(3500 + Math.random() * 2500);
}

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
