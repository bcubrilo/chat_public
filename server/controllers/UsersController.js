const { User, UserProfile } = require("../models");
const UserExtension = require("../models_extension/userExtension");
var fs = require("fs-extra");
var path = require("path");
var base64Img = require("base64-img");
var jimp = require("jimp");
var sharp = require("sharp");
const uuid = require("uuid");
const emailSender = require("./../utils/emailSender");
const joi = require("joi");
const sequelize = require("sequelize");
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}

module.exports = {
  async index(req, res) {
    try {
      let users = await User.findAll();
      res.send(users);
    } catch (err) {
      res.status(500).send({
        error: "Error happend, try again." + err,
      });
    }
  },

  async saveProfile(req, res) {
    try {
      const { userId } = req.body;
      if (userId > 0) {
        let profile = await UserProfile.findOne({
          where: {
            userId: userId,
          },
        });
        if (profile) {
          await UserProfile.update(req.body, {
            where: {
              userId: userId,
            },
          });
        } else {
          await UserProfile.create(req.body);
        }
        res.status(200).send({ message: "User is updated" });
      }
    } catch (err) {
      res.status(404).send({ error: "Error happend. Try again." + err });
    }
  },

  async getProfile(req, res) {
    let userId = req.user.id;
    if (userId > 0) {
      try {
        let profile = await UserProfile.findOne({
          where: {
            userId: userId,
          },
        });
        if (profile == null) {
          profile = await UserProfile.create({ userId: userId });
        }
        if (profile != null) {
          res.status(200).send({
            data: profile.toJSON(),
          });
        } else {
          res.status(200).send({ message: "Not found" });
        }
      } catch (err) {
        res
          .status(404)
          .send({ message: "Error happened while fetching the user." + err });
      }
    } else {
      res.status(404).send({ message: "User not provided" });
    }
  },

  async updateProfile(req, res) {
    try {
      let userId = req.user.id;
      if (userId > 0) {
        let profile = await UserProfile.findOne({
          where: {
            userId: userId,
          },
        });
        if (profile != null) {
          switch (req.body.field) {
            case "description":
              profile.description = req.body.value;
              break;
            case "profileImageUrl":
              profile.profileImageUrl = req.body.value;
              break;
            case "gender":
              profile.gender = req.body.value;
              break;
            case "interestedInGender":
              profile.interestedInGender = req.body.value;
              break;
            case "countryCode":
              profile.countryCode = req.body.value;
              break;
            case "languageCode":
              profile.languageCode = req.body.value;
              break;
            default:
              break;
          }
          profile
            .save()
            .then(() => res.status(200).send({ message: "Updated" }));
        } else {
          res.status(200).send({ message: "Could not find profile" });
        }
      }
    } catch (err) {
      res.status(500).send({ message: "Error happend while updating profile" });
    }
  },
  async updateUser(req, res) {
    try {
      let userId = req.user.id;
      if (userId > 0) {
        let user = await User.findOne({
          where: {
            id: userId,
          },
        });
        if (user) {
          var status = true;
          switch (req.body.field) {
            case "name":
              user.name = req.body.value;
              break;
            case "email":
              if (user.email !== req.body.value) {
                var schema = joi.object({
                  email: joi.string().email({ minDomainSegments: 3 }),
                });
                const { error, value } = schema.validate({
                  email: req.body.value,
                });
                if (error) {
                  res.status(400).send({ message: "Email not valid." });
                  status = false;
                  break;
                }
                var existingUser = await User.findOne({
                  where: {
                    email: req.body.value,
                    id: {
                      [sequelize.Op.not]: user.id,
                    },
                  },
                });
                if (existingUser) {
                  res.status(400).send({ message: "Email taken!" });
                  status = false;
                  break;
                }
                user.email = req.body.value;
                user.emailVerified = false;
                user.emailVerificationCode = uuid.v4();
                emailSender.sendEmailConfirmationLink(user);
              }
              break;
            case "appLanguageCode":
              user.appLanguageCode = req.body.value;
              break;
            default:
              break;
          }
          if (status)
            user.save().then(() => res.status(200).send({ message: "OK" }));
        } else {
          res.status(200).send({ message: "User not found." });
        }
      }
    } catch (err) {
      res.status(400).send({ message: "Error happend" });
    }
  },

  async getPublicProfile(req, res) {
    var user = await UserExtension.getUserPublicProfile(req.params.username);
    res.status(200).send({ data: user, message: "OK" });
  },
  async uploadProfileImage(req, res) {
    try {
      let profile = await UserProfile.findOne({
        where: {
          userId: req.user.id,
        },
      });

      let oldFileName = profile.profileImageUrl;
      let newFileName = profile.userId + "_" + Date.now() + ".jpg";

      let destinationPath = path.join(
        __basedir,
        "/public/images/profiles",
        newFileName
      );

      let tmpPath = path.join(__basedir, "/public/images", newFileName);

      fs.move(path.resolve(req.file.path), tmpPath).then(() => {
        var image = sharp(tmpPath);
        image
          .resize(48, 48)
          .toFile(path.join(__basedir, "/public/images/avatars", newFileName));

        image
          .resize(96, 96)
          .toFile(
            path.join(__basedir, "/public/images/big_avatars", newFileName)
          );
        try {
          image.metadata().then((m) => {
            if (m.width > 450) {
              image.resize(450, null).toFile(destinationPath);
            } else {
              image.toFile(destinationPath);
            }
            fs.unlink(tmpPath);
          });
          if (oldFileName != null && oldFileName.length > 0) {
            let oldImagePath = path.join(
              __basedir,
              "/public/images/profiles",
              oldFileName
            );
            let oldAvatarPath = path.join(
              __basedir,
              "/public/images/avatars",
              oldFileName
            );
            let oldBigAvatarPath = path.join(
              __basedir,
              "/public/images/big_avatars",
              oldFileName
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlink(oldImagePath);
            }
            if (fs.existsSync(oldAvatarPath)) {
              fs.unlink(oldAvatarPath);
            }
            if (fs.existsSync(oldBigAvatarPath)) {
              fs.unlink(oldBigAvatarPath);
            }
          }
        } catch (err) {}

        profile.profileImageUrl = newFileName;

        profile
          .save()
          .then(() => res.status(200).send({ filename: newFileName }));
      });
    } catch (err) {
      res.status(500).status({ message: "Error happend during uplaod." });
    }
  },
  async deleteProfileImage(req, res) {
    try {
      let profile = await UserProfile.findOne({
        where: {
          userId: req.user.id,
        },
      });
      if (profile != null) {
        var profileImageUrl = profile.profileImageUrl;
        if (
          profile.profileImageUrl != null &&
          profile.profileImageUrl.length > 0
        ) {
          profile.profileImageUrl = null;
          await profile.save();
          if (
            fs.exists(
              path.join(__basedir, "/public/images/profiles/", profileImageUrl)
            )
          ) {
            await fs.unlink(
              path.join(__basedir, "/public/images/profiles/", profileImageUrl)
            );
          }
          if (
            fs.exists(
              path.join(__basedir, "/public/images/avatars/", profileImageUrl)
            )
          ) {
            await fs.unlink(
              path.join(__basedir, "/public/images/avatars/", profileImageUrl)
            );
          }
        }
      }
      res.status(200).send({ message: "OK" });
    } catch (err) {
      res.status(200).send({ message: "Error happend" });
    }
  },
  async getMostRecentUsers(req, res) {
    try {
      let users = await UserExtension.getMostRecentUsers();
      users = users.filter((u) => u.username !== req.user.username);
      res.status(200).send({ data: users, message: "OK" });
    } catch (error) {
      res.status(500).send({ message: "Error happend." });
    }
  },
  async search(req, res) {
    try {
      var skip = parseInt(req.params.skip, 10);

      var countryCode =
        req.params.countryCode &&
        req.params.countryCode !== "null" &&
        req.params.countryCode !== "undefined"
          ? req.params.countryCode
          : null;
      var users = await UserExtension.search(
        req.params.keywords,
        countryCode,
        skip
      );
      res.status(200).send({ data: users, message: "OK" });
    } catch (error) {
      res.status(500).send({ message: "Error happend" });
    }
  },
  async changePassword(req, res) {
    try {
      var user = await User.findOne({
        where: {
          id: req.user.id,
        },
      });
      if (user != null) {
        if (
          user.changePassword(
            req.body.currentPassword,
            req.body.newPassword,
            req.body.newPasswordRepeated
          )
        ) {
          await user.save();
          res.statu(200).send({ message: "OK" });
          return;
        }
      }
    } catch (err) {}
    res.status(400).send({ message: "Error" });
  },
  async verifyEmail(req, res) {
    try {
      var username = req.params.username;
      var verificationCode = req.params.code;
      var user = await User.findOne({
        where: {
          username: username,
          emailVerificationCode: verificationCode,
        },
      });
      if (user) {
        if (user.emailVerified) {
          res.status(200).send({ message: "Email is already verified." });
        } else {
          user.emailVerified = true;
          await user.save();
          res.status(200).send({ message: "Email is verified." });
        }
      } else {
        res.status(200).send({ message: "Couldn't find the user!" });
      }
    } catch (error) {
      res.statu(400).send({ message: "Error verifying user!" });
    }
  },
  async recomendedUsers(req, res) {
    let users = await UserExtension.getRecomendedPeople(req.user.id);
    res.status(200).send({ users: users });
  },
};
