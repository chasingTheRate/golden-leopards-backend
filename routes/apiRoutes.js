const express = require('express');
const router = express.Router();

const glService = require('../services/goldenLeopardService');

router.get('/seasons', glService.getSeasons);
router.post('/seasons', glService.createSeasons);
router.delete('/seasons/:id', glService.deleteSeasons);

router.get('/games', glService.getGames);
router.post('/games', glService.createGames);
router.delete('/games/:id', glService.deleteGame);

router.get('/players', glService.getPlayers);
router.post('/players', glService.createPlayers);
router.delete('/players/:id', glService.deletePlayer);

router.get('/gameSegments', glService.getGameSegments);
router.post('/gameSegments', glService.createGameSegments);
router.delete('/gameSegments/:id', glService.deleteGameSegment);

router.get('/stats/players', glService.getPlayersStats);

router.get('/stats/teamRecord', glService.getTeamRecord);

module.exports = router;