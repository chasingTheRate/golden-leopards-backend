SELECT 
	g."position",
	COUNT(*),
    ROUND((COUNT(*) / (SUM(COUNT(*)) OVER() )) * 100, 0) AS percent_played_at_position
FROM
	public."gameSegments" g
JOIN
	players p
ON 
	p.id = g."playerId"
WHERE
	p."firstName" = 'Viviana' AND
	g."position" <> 'OPEN'
GROUP BY
	g."position"
ORDER BY
	percent_played_at_position DESC