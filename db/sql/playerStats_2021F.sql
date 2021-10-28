SELECT
	stats."playerName",
	stats.total_goals + sup_stats.total_goals AS total_goals,
	stats.total_assists + sup_stats.total_assists AS total_assists,
	stats.total_saves + sup_stats.total_saves AS total_saves,
	stats.total_goals_allowed + sup_stats.total_goals_allowed AS total_goals_allowed,
	stats.avg_minutes_played_per_game,
	stats.total_complete_games
FROM 
	player_stats stats
JOIN
	public."playersSupplementaryStats" sup_stats
ON
	sup_stats.playerid = stats.playerid
ORDER BY
	total_goals DESC,
	total_assists DESC,
	total_saves DESC,
	total_goals_allowed ASC