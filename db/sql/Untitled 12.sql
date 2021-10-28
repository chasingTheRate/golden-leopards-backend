SELECT 
	player."firstName" || ' ' || player."lastName",
	player.id,
	gamesegment.goals,
	SUM(gamesegment.goals) total_goals,
	SUM(gamesegment.assists) total_assists,
	SUM(gamesegment."goalsAllowed") total_goals_allowed,
	SUM(gamesegment.saves) total_saves
FROM
	players player
INNER JOIN
	"gameSegments" gamesegment
ON 
	player.id = gamesegment."playerId"
GROUP BY
	player.id,
	gamesegment.goals,
	gamesegment.assists,
	gamesegment."goalsAllowed",
	gamesegment.saves

	