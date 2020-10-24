module.exports = {
  GetRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  async AsyncForEach(array, callback) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < array.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  },

  Sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
