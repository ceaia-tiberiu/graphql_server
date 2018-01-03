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
  User: sequelize.import('./user')
};

db.sequilize = sequelize;
db.Sequilize = Sequelize;

export default db;
