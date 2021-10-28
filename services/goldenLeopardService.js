
const Ajv = require('ajv');

const glController = require('../controllers/goldenLeopardController');

const gameSchema = require('../schemas/gameSchema');
const seasonSchema = require('../schemas/seasonSchema');
const playerSchema = require('../schemas/playerSchema');
const gameSegmentSchema = require('../schemas/gameSegmentSchema');

const ajv = new Ajv();
const gameValidate = ajv.compile(gameSchema);
const seasonValidate = ajv.compile(seasonSchema);
const playerValidate = ajv.compile(playerSchema);
const gameSegmentValidate = ajv.compile(gameSegmentSchema);

const getSeasons = async (req, res) => {

  const seasons = await glController.getSeasons();
  res.json(seasons);
}

const createSeasons = async (req, res) => {
  
  const seasons = req.body;

  const valid = seasonValidate(seasons);

  if (!valid) {
    res.status(400).send(seasonValidate.errors);
    return;
  }

  const result = await glController.createSeasons(seasons);
  res.json('ok');
}

const deleteSeasons = async (req, res) => {
  
  const seasons = req.body;

  const { id } = req.params;
 
  if (!id) {
      res.status(400).send('Season Id required.');
      return;
  }

  try {
    await glController.deleteSeason(id);
    console.log('test');
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

const getGames = async (req, res) => {

  const games = await glController.getGames();
  res.json(games);
}

const createGames = async (req, res) => {

  const games = req.body;
  const valid = gameValidate(games);

  if (!valid) {
    res.status(400).send(gameValidate.errors);
    return;
  }

  const result = await glController.createGames(games);
  res.status(204).send();
}

const deleteGame = async (req, res) => {
  
  const seasons = req.body;

  const { id } = req.params;
 
  if (!id) {
      res.status(400).send('Game Id required.');
      return;
  }

  try {
    await glController.deleteGame(id);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

const getPlayers = async (req, res) => {

  const players = await glController.getPlayers();
  res.json(players);
}

const createPlayers = async (req, res) => {

  const players = req.body;
  const valid = playerValidate(players);

  if (!valid) {
    res.status(400).send(playerValidate.errors);
    return;
  }

  const result = await glController.createPlayers(players);
  res.status(204).send();
}

const deletePlayer = async (req, res) => {
  
  const { id } = req.params;
 
  if (!id) {
      res.status(400).send('Player Id required.');
      return;
  }

  try {
    await glController.deletePlayer(id);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

const getGameSegments = async (req, res) => {

  const gameSegments = await glController.getGameSegments();
  res.json(gameSegments);
}

const createGameSegments = async (req, res) => {

  const gameSegments = req.body;
  const valid = gameSegmentValidate(gameSegments);

  if (!valid) {
    res.status(400).send(gameSegmentValidate.errors);
    return;
  }

  const result = await glController.createGameSegments(gameSegments);
  res.status(204).send();
}

const deleteGameSegment = async (req, res) => {
  
  const { id } = req.params;
 
  if (!id) {
      res.status(400).send('Game Segment Id required.');
      return;
  }

  try {
    await glController.deleteGameSegment(id);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

const getPlayersStats = async (req, res) => {
  const playersStats = await glController.getPlayersStats();
  res.json(playersStats);
}

module.exports = {
  getSeasons,
  createSeasons,
  deleteSeasons,
  getGames,
  createGames,
  deleteGame,
  getPlayers,
  createPlayers,
  deletePlayer,
  getGameSegments,
  createGameSegments,
  deleteGameSegment,
  getPlayersStats
}