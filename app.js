const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { PORT, dataBasePath, limiter } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const cors = require('./middlewares/cors');
const { handleError } = require('./utils/utils');

const app = express();

mongoose.connect(dataBasePath, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors);

app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => handleError(err, req, res, next));

app.listen(PORT);
console.log(`Server starts at port: ${PORT}`);
