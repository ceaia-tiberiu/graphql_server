import Sequelize from 'sequelize';

// const sequelize = new Sequelize('reactql_db', 'reactql', 'reactql', {
//   host: 'localhost',
//   port: 5433,
//   dialect: 'postgres'
// });

const sequelize = new Sequelize(
    'postgres://reactql:reactql@localhost:5433/reactql_db'
);

const db = {
    User: sequelize.import('./user'),
    Board: sequelize.import('./board'),
    Suggestion: sequelize.import('./suggestions.js')
};

Object.keys(db).forEach(modelName => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequilize = sequelize;
db.Sequilize = Sequelize;

export default db;
