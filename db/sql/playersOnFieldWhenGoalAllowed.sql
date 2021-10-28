select
	--a.id,
	--a.goals,
	--a."gameId",
	--a."startingTimeInMinutes",
	b."playerId",
	c."firstName",
	b.position,
	count(b."playerId"),
	sum(b.duration) as "totalMinutes"
from "gameSegments" a
INNER JOIN 
	"gameSegments" b
	ON 
		b."gameId" = a."gameId"
	AND
		b."startingTimeInMinutes" = a."startingTimeInMinutes"
INNER JOIN
	"players" c
	ON
	 	c.id = b."playerId"
WHERE
	a."goalsAllowed" > 0
AND 
	b.position IN ('Left Defense', 'Center Defense', 'Right Defense')
GROUP BY 
	b."playerId",
	c."firstName",
	b.position,
	b.duration



		

