const { runQuery } = require('../db');

async function getLastGame(guild_id) {
  const result = await runQuery(
    'SELECT datetime, discord_user_name FROM games INNER JOIN participants ON participants.id = games.winner_participant_id WHERE games.discord_guild_id = $1 ORDER BY datetime DESC',
    [guild_id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function saveGame(guild_id, winner_user_id) {
  await runQuery('INSERT INTO games (discord_guild_id, winner_participant_id, datetime) VALUES ($1, $2, $3)', [
    guild_id,
    winner_user_id,
    Math.floor(Date.now() / 1000),
  ]);
}

async function getStatistics(guild_id) {
  const {
    rows,
  } = await runQuery(
    'SELECT discord_user_name, score FROM participants WHERE score > 0 AND discord_guild_id = $1 ORDER BY score DESC LIMIT $2',
    [guild_id, 10]
  );

  let topString = '**Топ-10 пидоров за все время:**\n';
  rows.forEach((row) => {
    topString += `${row.discord_user_name} - ${row.score}\n`;
  });
  return topString;
}

module.exports = {
  getLastGame,
  saveGame,
  getStatistics,
};
