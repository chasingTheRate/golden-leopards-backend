select
	a.id,
	a.goals,
	a."playerId",
	a."startingTimeInMinutes",
	a."position",
	b."firstName"
FROM
	"gameSegments" a
INNER JOIN
	"players" b
ON
	b.id = a."playerId"
WHERE
	"gameId" = '4181cbd7-8ff9-4df9-a7fe-011e9e977358'
