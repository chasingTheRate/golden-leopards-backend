select
	--a.id,
	--a.goals,
	--a."gameId",
	--a."startingTimeInMinutes",
	--a."playerId",
	b."firstName",
	SUM(a."goals")
from "gameSegments" a
INNER JOIN
 	"players" b
ON
	b.id = a."playerId"
WHERE
	a.goals > 0
GROUP BY 
 a."playerId",
 b."firstName"