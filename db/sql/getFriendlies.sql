SELECT
  *
FROM
  games g
WHERE
  g.game_type = 'friendly'
AND
  g.start >= Now()