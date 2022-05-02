
const Ajv = require('ajv');

const glController = require('../controllers/goldenLeopardController');
const notifications = require('../util/notifications');

const getSeasonSchedule = async (req, res) => {
  const seasonSchedule = await glController.getSeasonSchedule();
  res.json(seasonSchedule);
}

const getTournamentSchedules = async (req, res) => {
  const tournamentSchedule = await glController.getTournamentSchedules();
  res.json(tournamentSchedule);
}

const updateTournament = async (req, res) => {
  const { params: { id }, body } = req;
  const tournament = await glController.updateTournament(id, body);
  res.json(tournament);
}

const getRoster = async (req, res) => {
  const roster = await glController.getRoster();
  res.json(roster);
}

const checkForUpdates = async (req, res) => {
  try {
    
    result = await glController.checkForUpdates();
    const { gamesCreated = 0, gamesUpdated = 0 } = result;

    if (gamesCreated > 0 || gamesUpdated > 0) {
      const message = `Game(s) Updated! \n\n GamesCreated: ${gamesCreated} GamesUpdated: ${gamesUpdated}`;
      notifications.send(message);
      return res.status(200).send(message);
    }

    res.status(204).send();

  } catch(e) {
    console.error(e);
    notifications.send(`Error updating games!: \n${e}`);
    res.status(500).send('Error updating games');
  }
}

const getNextGames = async (req, res) => {
  try {
    
    result = await glController.getNextGames();
    res.json(result);

  } catch(e) {
    console.error(e);
    res.status(500).send();
  }
}

const clearTournamentScheduleCache = async (req, res) => {
  try {
    glController.clearTournamentScheduleCache();
    res.status(200).send('cache-cleared');
  } catch(e) {
    console.error(e);
    res.status(500).send();
  }
}

const lastGameResults = async (req, res) => {
  try {
    result = await glController.getLastGameResults();
    res.json(result);
  } catch(e) {
    console.error(e);
    res.status(500).send();
  }
}

const getLeagues = async (req, res) => {
  try {
    result = await glController.getLeagues();
    res.json(result);
  } catch(e) {
    console.error(e);
    res.status(500).send();
  }
}

module.exports = {
  getSeasonSchedule,
  getTournamentSchedules,
  updateTournament,
  getRoster,
  checkForUpdates,
  getNextGames,
  clearTournamentScheduleCache,
  lastGameResults,
  getLeagues
}