const router = require('express').Router();
const cookieParser = require('cookie-parser');
const userRouter = require('./users');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserCreate, validateUserLogin } = require('../utils/validetion');

router.use(cookieParser());
router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateUserLogin, login);
router.use(auth);
router.use('/users', userRouter);
router.post('/signout', logout);

router.use((req, res, next) => {
  const error = new NotFoundError('невозможно отобразить страницу');
  next(error);
});

module.exports = router;
