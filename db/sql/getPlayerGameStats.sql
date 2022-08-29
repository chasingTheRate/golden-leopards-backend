SELECT
	pgs.game_id,
	pgs.player_id,
	p.displayName,
	pgs.goals,
	pgs.assists,
	pgs.saves,
	pgs.defensive_tackles,
	g.start
FROM
	public.player_game_stats pgs 
JOIN
	games g
ON
	g.id = pgs.game_id
JOIN
	players p
ON
	pgs.player_id = p.id;
