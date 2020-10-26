const dotenv = require('dotenv');
const DiscordJS = require('discord.js');
const message = require('./src/events/message');

dotenv.config();
const DiscordClient = new DiscordJS.Client();

DiscordClient.on('message', (...args) => message(DiscordClient, ...args));

// eslint-disable-next-line
DiscordClient.login(process.env.BOT_TOKEN).then(() => console.log('The bot has started!'));
