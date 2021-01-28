function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// countFormatter(count, ['найдена', 'найдено', 'найдены']);
function countFormatter(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
}

module.exports = {
  getRandomElement,
  asyncForEach,
  sleep,
  countFormatter,
};
