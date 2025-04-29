const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  address: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  walletCreation: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  socialGoogle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  socialTwitter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  socialLinkedin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nonce: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
