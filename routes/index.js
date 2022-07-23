const router = require('express').Router();
const cookieParser = require('cookie-parser');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserCreate, validateUserLogin } = require('../utils/validetion');
const { errorMessages } = require('../utils/constants');

router.use(cookieParser());
router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateUserLogin, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.post('/signout', logout);

router.use((req, res, next) => {
  const error = new NotFoundError(errorMessages.pageNotFound);
  next(error);
});

module.exports = router;
