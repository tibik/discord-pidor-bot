class GamesRepository {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async GetLastGame(guild_id) {
    const result = await this.dbAdapter.query(
      'SELECT datetime, discord_user_name FROM games INNER JOIN participants ON participants.id = games.winner_participant_id WHERE games.discord_guild_id = $1 ORDER BY datetime DESC',
      [guild_id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  SaveGameInformation(guild_id, winner_user_id) {
    this.dbAdapter.query('INSERT INTO games (discord_guild_id, winner_participant_id, datetime) VALUES ($1, $2, $3)', [
      guild_id,
      winner_user_id,
      Math.floor(Date.now() / 1000),
    ]);
  }
}

module.exports = GamesRepository;
