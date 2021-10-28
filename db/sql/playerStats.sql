SELECT 
	player."firstName" || ' ' || player."lastName" AS player,
	coalesce(SUM(gamesegment.goals), 0) total_goals,
	coalesce(SUM(gamesegment.assists), 0) total_assists,
	coalesce(SUM(gamesegment."goalsAllowed"), 0) total_goals_allowed,
	coalesce(SUM(gamesegment.saves), 0) total_saves
FROM
	players player
INNER JOIN
	"gameSegments" gamesegment
ON 
	player.id = gamesegment."playerId"
GROUP BY
	player.id
ORDER BY
	total_goals DESC