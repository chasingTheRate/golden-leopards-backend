SELECT
	pgs.game_id,
	pgs.player_id,
	p.displayName,
	pgs.goals,
	pgs.assists,
	pgs.saves,
	pgs.defensive_tackles,
	pgs.attacking_tackles,
	pgs.passes,
	pgs.fouls,
	pgs.captain,
	pgs.did_not_record_assists,
	pgs.did_not_record_saves,
	pgs.did_not_record_tackles,
	pgs.did_not_record_passes,
	pgs.did_not_record_fouls,
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
