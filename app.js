const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { PORT, dataBasePath } = require('./utils/constants');
const router = require('./routes/index');
const { handleError } = require('./utils/utils');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect(dataBasePath, {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', router);

app.use(errors());
app.use((err, req, res, next) => handleError(err, req, res, next));

app.listen(PORT);
console.log(`Server starts at port: ${PORT}`);
