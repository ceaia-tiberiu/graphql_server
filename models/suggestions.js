export default (sequilizer, DataTypes) => {
    const Suggestion = sequilizer.define('suggestion', {
        text: DataTypes.STRING
    });

    return Suggestion;
};
