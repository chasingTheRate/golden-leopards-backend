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
	g.opponentshortname,
	l.height AS logoHeight,
	l.width AS logoWidth,
	l.filename AS logoFilename,
	lg.leagueid
FROM 
	public.games g
LEFT OUTER JOIN 
	public.logos l
ON 
	g.logoid = l.id
JOIN 
	public.leagues_games lg
ON
	g.id = lg.gameid	
ORDER BY 
	start DESC