select
	--a.id,
	--a.goals,
	--a."gameId",
	--a."startingTimeInMinutes",
	--a."playerId",
	b."firstName",
	SUM(a."goalsAllowed")
from "gameSegments" a
INNER JOIN
 	"players" b
ON
	b.id = a."playerId"
WHERE
	a."goalsAllowed" > 0
GROUP BY 
 a."playerId",
 b."firstName",
 a."goalsAllowed"