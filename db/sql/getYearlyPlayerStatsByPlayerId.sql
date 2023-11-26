SELECT
	l.year,
	COUNT(p.id) as games,
	SUM(pgs.goals) as goals,
	SUM(pgs.saves) as saves,
	SUM(pgs.defensive_tackles) as tackles,
	SUM(pgs.attacking_tackles) as attacking_tackles,
	SUM(pgs.assists) as assists,
	SUM(pgs.passes) as passes,
	SUM(pgs.fouls) as fouls
FROM
	public.players p
JOIN
	player_game_stats pgs
ON
	p.id = pgs.player_id
JOIN
	games g
ON
	pgs.game_id = g.id
JOIN
	leagues l
ON
	g.league_id = l.id
WHERE
	p.id = ?
GROUP BY
	l.year
ORDER BY
	l.year
DESC
