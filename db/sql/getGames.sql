SELECT
	g.id,
	g.start,
	g.opponent,
	g.hometeam,
	g.awayteam,
	g.is_hometeam,
	g.field,
	g.recordgame,
	g.veolink,
	g.ourscore,
	g.hide,
	g.opponentscore,
	g.gamestatus,
	g.league_id,
	g.logoid,
	g.opponentshortname,
	g.reverse_colors,
	g.game_type,
	g.golden_leopards_plus,
	l.height AS logoHeight,
	l.width AS logoWidth,
	l.filename AS logoFilename
FROM 
	public.games g
LEFT OUTER JOIN 
	public.logos l
ON 
	g.logoid = l.id
ORDER BY 
	start DESC