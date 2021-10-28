SELECT
 "gameId",
 count("gameId")
FROM public."gameSegments"
Group BY "gameId"