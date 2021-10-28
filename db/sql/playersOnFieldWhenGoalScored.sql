select
	--a.id,
	--a.goals,
	--a."gameId",
	--a."startingTimeInMinutes",
	b."playerId",
	c."firstName",
	count(b."playerId")
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
	a.goals > 0
GROUP BY 
	b."playerId",
	c."firstName"



		

