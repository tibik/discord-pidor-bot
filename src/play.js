const { getLastGame } = require('./workers/games');
const { getRandomElement, asyncForEach, sleep } = require('./helpers');

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

module.exports = {
  canStartGame,
  tease,
};
