const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    rating: {
      type: DataTypes.REAL,
      validate: {
        min: 1,
        max: 5,
      },
      allowNull: false,
    },

    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
