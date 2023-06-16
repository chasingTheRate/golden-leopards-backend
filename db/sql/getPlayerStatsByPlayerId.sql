SELECT
	p.id,
	p.displayname,
	pgs.goals,
	pgs.saves,
	pgs.defensive_tackles,
	pgs.assists,
	g.opponent,
	g.veolink,
	l.year,
	l.displayname
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