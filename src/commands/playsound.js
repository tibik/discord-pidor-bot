const path = require('path');
const fs = require('fs');
const Sentry = require('../helpers/log');

const files = fs.readdirSync(path.join(__dirname, '../audio/'));
const fileNames = files.map((f) => {
  const [fileName] = f.split('.');
  return fileName;
});

module.exports = async (msg) => {
  try {
    const args = msg.content.slice('!'.length).trim().split(/ +/);
    args.shift();
    const firstArg = args[0];

    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
      return msg.channel.send('Зайди в голосовой канал, чтобы воспользоваться данной командой.');
    }

    if (fileNames.includes(firstArg)) {
      const connection = await voiceChannel.join();
      const audioPath = path.join(__dirname, `../audio/${firstArg}.mp3`);
      const dispatcher = connection.play(audioPath, { volume: 0.5 });
      dispatcher.on('finish', () => {
        voiceChannel.leave();
      });
      return null;
    }

    return msg.channel.send('Такой аудиофайл не найден');
  } catch (e) {
    Sentry.captureException(e);
    console.log('playsound.js:35 | ', 'e =', e);
    msg.channel.send('Чот не так пошло, я информацию куда надо передал, дальше уже не от меня зависит.');
  }
};
