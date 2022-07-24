const router = require('express').Router();
const { getMovies, makeMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieMake, validateMovieId } = require('../utils/validetion');

router.get('/', getMovies);
router.post('/', validateMovieMake, makeMovie);
router.delete('/:_id', validateMovieId, deleteMovie);

module.exports = router;
