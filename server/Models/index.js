const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:qqwwee112233@localhost:5432/Web', {
    dialect: 'postgres',
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected to discover');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const dbModule = {};
dbModule.Sequelize = Sequelize;
dbModule.sequelize = sequelize;
dbModule.users = require('./userModel')(sequelize, DataTypes);
dbModule.tasks = require('./taskModel')(sequelize, DataTypes);

module.exports = dbModule;
