SELECT
	p.displayname,
	COUNT(p.id) AS games_played,
	SUM(pgs.goals) AS goals,
	SUM(pgs.assists) AS assists,
	SUM(pgs.saves) AS saves,
	SUM(pgs.defensive_tackles) AS def_tackles
FROM
	public.player_game_stats pgs
JOIN
	public.players p
ON
	p.id = pgs.player_id
JOIN
	public.games g
ON
	g.id = pgs.game_id
JOIN
	public.leagues l
ON
	g.league_id = l.id
WHERE
	l.id = ?
GROUP BY 
	p.displayname