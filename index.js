const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const sequelize = require('./utils/db');
const toJsonErrors = require('./utils/errors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use(authRoutes);

app.use(toJsonErrors);

sequelize.sync({ force: false }).then(() => {
    console.log('Connected to MySQL and synchronized Sequelize models');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
