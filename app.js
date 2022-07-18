require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { PORT = 3000, DB_PATH } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect(DB_PATH, {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(PORT);
console.log(`Server starts at port: ${PORT}`);
