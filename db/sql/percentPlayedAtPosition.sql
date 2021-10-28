SELECT
	"position",
	((count("position") * 100)/ (SELECT count("position") FROM "gameSegments" WHERE "playerId" = '55a47839-fc27-45bf-8f02-187a024aa618')) AS perc_played_at_position
FROM "gameSegments" 
WHERE "playerId" = '55a47839-fc27-45bf-8f02-187a024aa618'
GROUP BY "position"
ORDER BY perc_played_at_position DESC