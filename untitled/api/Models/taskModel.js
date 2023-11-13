module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("task", {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Not Started'
            },

            resolution : {
                type: DataTypes.STRING,
                allowNull: false,
            },
            filePath:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            progress:{
                type: DataTypes.INTEGER,

            },
            result:{
                type: DataTypes.STRING,

            }
        },
        {
            timestamps: false
        });

    Task.associate = (models) => {
        Task.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Task;
};
