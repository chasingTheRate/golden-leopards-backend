SELECT
	gp.id,
	gp.player_id,
	gp.game_id,
	p.displayname
FROM 
	public.games_players gp
JOIN
	players p
ON 
	gp.player_id = p.id;