'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.Review, { foreignKey: 'spotId' })
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', as: "previewImage" })
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' })
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner'})

    }
  }
  Spot.init({
    ownerId: {type: DataTypes.INTEGER,
    allowNull: false
    },


    address: {type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            // res.status(400)
            throw new Error('Address must be a string')
          }
        }
      }
    },


    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            // res.status(400)
            throw new Error('City must be a string')
          }
        }
      }
    },


    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            // res.status(400)
            throw new Error('State must be a string')
          }
        }
      }
    },


    country: {type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value){
          if (typeof value !== "string"){
            // res.status(400)
            throw new Error('Country must be a string')
          }
        }
      }
    },


    lat: {type: DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        max: 90,
        min: -90
      }
    },

    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        max: 180,
        min: -180
      }
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            // res.status(400)
            throw new Error('Name must be a string')
          }
        }
      }
    },


    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            throw new Error('Description must be a string')
          }
        }
      }
    },

    price: {type: DataTypes.DECIMAL,
      allowNull: false,
    },


  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};