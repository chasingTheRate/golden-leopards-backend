const express = require('express');
const router = express.Router();

const glService = require('../services/goldenLeopardService');

router.get('/clearCache', glService.clearAllCache);

router.get('/schedules/season', glService.getSeasonSchedule);
router.get('/schedules/nextgames', glService.getNextGames);
router.get('/schedules/last-game-results', glService.lastGameResults);
router.post('/schedules/games', glService.createGame);
router.put('/schedules/games/:id', glService.updateGame);

router.get('/schedules/tournaments/clearCache', glService.clearTournamentScheduleCache);
router.get('/schedules/tournaments', glService.getTournamentSchedules);
router.put('/schedules/tournaments/:id', glService.updateTournament);

router.put('/schedules/season/checkForUpdates', glService.checkForUpdates);

router.get('/leagues', glService.getLeagues);

router.get('/roster', glService.getRoster);

router.get('/logos', glService.getLogos);

module.exports = router;