export default (sequilizer, DataTypes) => {
    const Board = sequilizer.define('board', {
        name: DataTypes.STRING
    });

    Board.associate = models => {
        // 1 to many to suggestions
        Board.hasMany(models.Suggestion, {
            foreignKey: 'boardId'
        });
    };

    return Board;
};
