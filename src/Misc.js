module.exports = {
  GetRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  async AsyncForEach(array, callback) {
    for (let index = 0; index < array.length; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  },

  Sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
