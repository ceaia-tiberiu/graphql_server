export default (sequilizer, DataTypes) => {
    const User = sequilizer.define('User', {
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        password: DataTypes.STRING
    });

    User.associate = models => {
        // 1 to many width board
        User.hasMany(models.Board, {
            foreignKey: 'owner'
        });

        // 1 to many width suggestion
        User.hasMany(models.Suggestion, {
            foreignKey: 'creatorId'
        });
    };

    return User;
};
