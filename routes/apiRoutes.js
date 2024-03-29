const express = require('express');
const router = express.Router();

const glService = require('../services/goldenLeopardService');

router.get('/clearCache', glService.clearAllCache);

router.get('/schedules/friendlies', glService.getFriendlies);
router.get('/schedules/season', glService.getSeasonSchedule);
router.get('/schedules/nextgames', glService.getNextGames);
router.get('/schedules/last-game-results', glService.lastGameResults);
router.post('/schedules/games', glService.createGame);
router.post('/schedules/games/:id/updatePlayerGameStats', glService.updatePlayerGameStats);
router.put('/schedules/games/:id/players', glService.updateGamePlayers);
router.put('/schedules/games/:id', glService.updateGame);

router.get('/schedules/tournaments/clearCache', glService.clearTournamentScheduleCache);
router.get('/schedules/tournaments', glService.getTournamentSchedules);

router.post('/schedules/tournaments', glService.createTournament);

router.put('/schedules/tournaments/:id/players', glService.updateTournamentPlayers);
router.put('/schedules/tournaments/:id', glService.updateTournament);

router.put('/schedules/season/checkForUpdates', glService.checkForUpdates);

router.get('/leagues', glService.getLeagues);
router.post('/leagues', glService.createLeague);
router.get('/leagues/:id/schedule', glService.getLeagueSchedule);
router.patch('/leagues/:id', glService.updateLeague);


router.get('/players', glService.getPlayersWithCurrentStats);
router.get('/players/:id/stats', glService.getPlayerStatsByPlayerId);
router.get('/players/:id', glService.getPlayerById);


router.get('/roster', glService.getRoster);

router.get('/logos', glService.getLogos);

module.exports = router;