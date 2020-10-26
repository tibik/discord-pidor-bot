const { runQuery } = require('../db');

async function getRandomPlayer(guild_id) {
  const result = await runQuery(
    'SELECT id, discord_user_id, discord_user_name FROM participants WHERE discord_guild_id = $1 ORDER BY random() LIMIT 1',
    [guild_id]
  );

  return result.rows[0];
}

async function addPlayer(user_id, guild_id, name) {
  await runQuery(
    'INSERT INTO participants(discord_user_id, discord_guild_id, discord_user_name, score) VALUES ($1, $2, $3, $4)',
    [user_id, guild_id, name, 0]
  );
}

async function removePlayer(user_id, guild_id) {
  await runQuery('DELETE FROM participants WHERE discord_user_id = $1 AND discord_guild_id = $2', [user_id, guild_id]);
}

async function checkPlayer(user_id, guild_id) {
  const result = await runQuery('SELECT * FROM participants WHERE discord_user_id = $1 AND discord_guild_id = $2', [
    user_id,
    guild_id,
  ]);

  return result.rowCount > 0;
}

async function updatePlayerScore(player_id) {
  await runQuery('UPDATE participants SET score = score + 1 WHERE id = $1', [player_id]);
}

async function getPlayers(guild_id) {
  const { rows } = await runQuery('SELECT discord_user_name FROM participants WHERE discord_guild_id = $1', [guild_id]);

  let topString = '**Список игроков:**\n';
  rows.forEach((row, idx) => {
    topString += `${idx + 1}. ${row.discord_user_name}\n`;
  });
  return topString;
}

module.exports = {
  getRandomPlayer,
  addPlayer,
  removePlayer,
  checkPlayer,
  updatePlayerScore,
  getPlayers,
};
