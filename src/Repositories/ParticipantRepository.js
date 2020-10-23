class ParticipantsRepository {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter;
  }

  async GetRandomParticipant(guild_id) {
    return this.dbAdapter
      .query(
        'SELECT id, discord_user_id, discord_user_name FROM participants WHERE discord_guild_id = $1 ORDER BY random() LIMIT 1',
        [guild_id]
      )
      .then((result) => {
        if (result === undefined) {
          return null;
        }

        return result.rows[0];
      });
  }

  AddParticipant(user_id, guild_id, name) {
    this.dbAdapter.query(
      'INSERT INTO participants(discord_user_id, discord_guild_id, discord_user_name, score) VALUES ($1, $2, $3, $4)',
      [user_id, guild_id, name, 0]
    );
  }

  RemoveParticipant(user_id, guild_id) {
    this.dbAdapter.query('DELETE FROM participants WHERE discord_user_id = $1 AND discord_guild_id = $2', [user_id, guild_id]);
  }

  IsParticipantExists(user_id, guild_id) {
    return this.dbAdapter
      .query('SELECT * FROM participants WHERE discord_user_id = $1 AND discord_guild_id = $2', [user_id, guild_id])
      .then((result) => {
        return result.rowCount > 0;
      });
  }

  ScoreParticipant(participant_id) {
    this.dbAdapter.query('UPDATE participants SET score = score + 1 WHERE id = $1', [participant_id]);
  }
}

module.exports = ParticipantsRepository;
