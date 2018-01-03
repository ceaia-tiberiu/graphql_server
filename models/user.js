export default (sequilizer, DataTypes) => {
    const User = sequilizer.define('User', {
        username: DataTypes.STRING
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
