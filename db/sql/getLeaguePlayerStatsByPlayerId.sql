SELECT
	g.opponent,
	g.ourscore,
	g.opponentscore,
	g."start",
	g.veolink,
  g.recordgame,
	pgs.goals as goals,
	pgs.saves as saves,
	pgs.defensive_tackles as tackles,
	pgs.assists as assists
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
AND
	l.id = ?
ORDER BY
	g.start
DESC