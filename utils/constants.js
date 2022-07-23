require('dotenv').config();
const rateLimit = require('express-rate-limit');

const {
  NODE_ENV,
  PORT = 3000,
  DB_PATH,
  JWT_SECRET,
} = process.env;

module.exports.JWT_CODE = NODE_ENV === 'production' ? JWT_SECRET : 'jwt_dev_13';
module.exports.dataBasePath = DB_PATH;
module.exports.PORT = PORT;
module.exports.COOKIES_SECURE = NODE_ENV === 'production';

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports.emailRegExp = /[\w\d\S]+@[\w\d\S]+\.[\w]{2,6}$/i;
module.exports.urlRegExp = /^(https?:\/\/)(w{3}\\.)*([a-zA-Zа-яА-Я\-_\d]{2,256}\.)+([a-zA-Zа-яА-Я]{2,6})(\/?[\S]*)*?(#$)?/i;

module.exports.errorMessages = {
  userNotFound: 'пользователь не найден или удален',
  userExisted: 'пользователь с таким email уже существует',
  userBadRequest: 'не заполнены email или пароль',
  userEmailBadRequest: 'email введен некорректно',
  userLoggin: 'необходимо залогиниться',
  movieChoosen: 'такой фильм уже выбран',
  movieNotFound: 'фильм не найден или удален',
  movieNotToDelete: 'можно удалить только самостоятельно выбранный фильм',
  pageNotFound: 'невозможно отобразить страницу',
  badRequest: 'некорректный запрос',
  notFound: 'данные не найдены',
};
