SELECT 
	l.id,
	l.name,
	l.displayname,
	l.year,
	l.type,
	l.scheduleurl,
	l.logoid,
	l.placement,
	lo.height AS logoheight,
	lo.width AS logowidth,
	lo.filename AS logofilename,
	record.wins AS wins,
	record.losses AS losses,
	record.ties AS ties
FROM 
	public.leagues l
LEFT JOIN
	public.logos lo
ON 
	l.logoid = lo.id
LEFT OUTER JOIN
	(
		SELECT
			l.id as leagueId,
			SUM(CASE WHEN g.ourscore - g.opponentscore > 0 THEN 1 ELSE 0 END) AS Wins,
			SUM(CASE WHEN g.ourscore - g.opponentscore < 0 THEN 1 ELSE 0 END) AS Losses,
			SUM(CASE WHEN g.ourscore - g.opponentscore = 0 THEN 1 ELSE 0 END) AS ties
		FROM 
			public.leagues as l
		LEFT JOIN
			public.games g
		ON 
			g.league_id = l.id
		WHERE
			g.gamestatus = 'final'
		GROUP BY
			l.id
	) AS record
ON
	record.leagueId = l.id