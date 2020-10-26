const path = require('path');
const fs = require('fs');

const files = fs.readdirSync(path.join(__dirname, '../audio/'));
const fileNames = files.map((f) => {
  const [fileName] = f.split('.');
  return fileName;
});

module.exports = async (msg) => {
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
};
