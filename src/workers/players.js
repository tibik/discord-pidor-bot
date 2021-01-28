const { runQuery } = require('../db');
const Sentry = require('../helpers/log');

async function getRandomPlayer(guild_id) {
  try {
    const result = await runQuery(
      'SELECT id, discord_user_id, discord_user_name FROM participants WHERE discord_guild_id = $1 ORDER BY random() LIMIT 1',
      [guild_id]
    );

    return result.rows[0];
  } catch (e) {
    Sentry.captureException(e);
    console.log('players.js:14 | ', 'e =', e);
  }
}

async function addPlayer(user_id, guild_id, name) {
  try {
    await runQuery(
      'INSERT INTO participants(discord_user_id, discord_guild_id, discord_user_name, score) VALUES ($1, $2, $3, $4)',
      [user_id, guild_id, name, 0]
    );
  } catch (e) {
    Sentry.captureException(e);
    console.log('players.js:14 | ', 'e =', e);
  }
}

async function removePlayer(user_id, guild_id) {
  try {
    await runQuery('DELETE FROM participants WHERE discord_user_id = $1 AND discord_guild_id = $2', [user_id, guild_id]);
  } catch (e) {
    Sentry.captureException(e);
    console.log('players.js:14 | ', 'e =', e);
  }
}

async function checkPlayer(user_id, guild_id) {
  try {
    const result = await runQuery('SELECT * FROM participants WHERE discord_user_id = $1 AND discord_guild_id = $2', [
      user_id,
      guild_id,
    ]);

    return result.rowCount > 0;
  } catch (e) {
    Sentry.captureException(e);
    console.log('players.js:14 | ', 'e =', e);
  }
}

async function updatePlayerScore(player_id) {
  try {
    await runQuery('UPDATE participants SET score = score + 1 WHERE id = $1', [player_id]);
  } catch (e) {
    Sentry.captureException(e);
    console.log('players.js:14 | ', 'e =', e);
  }
}

async function getPlayers(guild_id) {
  try {
    const { rows } = await runQuery('SELECT discord_user_name FROM participants WHERE discord_guild_id = $1', [guild_id]);

    let topString = '**Список игроков:**\n';
    rows.forEach((row, idx) => {
      topString += `${idx + 1}. ${row.discord_user_name}\n`;
    });
    return topString;
  } catch (e) {
    Sentry.captureException(e);
    console.log('players.js:14 | ', 'e =', e);
  }
}

module.exports = {
  getRandomPlayer,
  addPlayer,
  removePlayer,
  checkPlayer,
  updatePlayerScore,
  getPlayers,
};
