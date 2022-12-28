SELECT 
	l.id,
	l.name,
	l.displayname,
	l.year,
	l.type,
	l.scheduleurl,
	l.logoid,
	lo.height AS logoheight,
	lo.width AS logowidth,
	lo.filename AS logofilename
FROM 
	public.leagues l
LEFT JOIN
	public.logos lo
ON 
	l.logoid = lo.id