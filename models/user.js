export default (sequilizer, DataTypes) => {
  const User = sequilizer.define('User', {
    username: DataTypes.STRING
  });

  return User;
};
