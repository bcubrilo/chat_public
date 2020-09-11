"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      userId: DataTypes.BIGINT,
      profileImageUrl: DataTypes.STRING,
      countryId: DataTypes.INTEGER,
      languageId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      gender: DataTypes.STRING(1),
      interestedInGender: DataTypes.STRING(1),
      countryCode: DataTypes.STRING(2),
      languageCode: DataTypes.STRING(2)
    },
    {}
  );
  UserProfile.associate = function(models) {};
  return UserProfile;
};
