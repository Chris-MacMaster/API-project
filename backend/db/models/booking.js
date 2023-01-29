'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'userId' })
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId' })

    }
  }
  Booking.init({
    spotId: {type: DataTypes.INTEGER,
    allowNull: false
    },
    userId: {type: DataTypes.INTEGER,
    allowNull: false
    },
    startDate: {type: DataTypes.STRING,
      allowNull: false
    // validate: {
    //   isDate(value){
    //     let dates = value.split('-')
    //     if (isNan(value)){
    //       throw new Error('Must be valid date')
    //     }
    //   }
    // }
    },
    endDate: {type: DataTypes.STRING,
    allowNull: false,

    validate: {
      isDate(value) {
        let dates = value.split('-').join('')
        if (!parseInt(dates)) {
          throw new Error('Must be valid date')
        }
      },
      // afterStart(value){
      //   let afters = value.split('-').join("")
      //   let starts = this.startDate.split('-').join('')

      //   afterNumber = parseInt(afters)
      //   startNumber = parseInt(starts)

      //   if (afterNumber <= startNumber){
      //     throw new Error('endDate cannot be on or before startDate')
      //   }
      // }
    }
    
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};