const bcrypt = require("bcryptjs");
const myModels = require("./../models");
const UserProfile = require("./userprofile");
const uuid = require("uuid");

async function hashPassword(password) {
  let passwordHash = "";
  await bcrypt.genSalt(10, async (err, salt) => {
    await bcrypt.hash(password, salt, (err, hash) => {
      passwordHash = hash;
    });
  });
  return passwordHash;
}

async function hashPassword1(user) {
  const password = user.password;
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      passwordSalt: DataTypes.STRING,
      appLanguageCode: DataTypes.STRING,
      emailVerified: DataTypes.BOOLEAN,
      emailVerificationCode: DataTypes.UUID,
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          user.passwordSalt = await bcrypt.genSalt(10);
          user.password = bcrypt.hashSync(user.password, user.passwordSalt);
          user.emailVerificationCode = uuid.v4();
        },
        afterCreate: async (user, options) => {
          console.log("Params:", user, options);
          sequelize.models.UserProfile.create({
            userId: user.id,
            gender: "",
          });
        },
      },
    }
  );
  User.associate = function (models) {
    // User.hasMany(models.Channel, {
    //   through: "Channelmembers",
    //   key: "userId",
    //   as: "channels"
    // });
    User.hasOne(models.UserProfile, { foreignKey: "userId", as: "profile" });
  };

  User.prototype.comparePassword = async function (password) {
    let status = false;
    status = await bcrypt.compare(password, this.password);
    return status;
  };
  User.prototype.findByUsername = async function (username) {
    var user = {};
    try {
      user = User.findOne({
        where: {
          username: username,
        },
        attributes: ["name", "username"],
        include: [
          {
            model: myModels.UserProfile,
            as: "profile",
          },
        ],
      });
    } catch (ex) {
      console.log(ex);
    }
    return user;
  };
  User.prototype.changePassword = async function (
    currentPassword,
    newPassword,
    newPasswordRepeated
  ) {
    try {
      var regex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      console.log("Test password:", regex.test(newPassword));
      if (
        regex.test(newPassword) &&
        newPassword === newPasswordRepeated &&
        this.comparePassword(currentPassword)
      ) {
        var passHash = bcrypt.hashSync(newPassword, this.passwordSalt);
        this.password = passHash;
        return true;
      }
    } catch (error) {}
    return false;
  };
  return User;
};
