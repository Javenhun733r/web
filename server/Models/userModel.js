module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        limit: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
        }
    }, {
        timestamps: false
    });


    User.associate = (models) => {
        User.hasMany(models.Task, { foreignKey: 'taskId' });
    };

    return User;
};
