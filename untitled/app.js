const express = require('express');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./api/Models');
const Routes = require('./api/Routes/Routes');
const cors = require("cors");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/', Routes);

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));