const models = require("../models");
const sequelize = require("sequelize");
const _ = require("lodash");
module.exports = {
  async findChannelsByUserId(userId) {
    let channels = [];
    let res = await models.sequelize.query(
      `
        SELECT DISTINCT C.id
        FROM Channels C
        LEFT JOIN ChannelMembers CM
          ON C.id = CM.channelId
        LEFT JOIN UserChannelDeleteds D
          ON CM.userId = D.userId AND C.id = D.channelId
        WHERE CM.userId = :userId AND D.channelId IS NULL
      `,
      {
        replacements: { userId: userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    let ids = res.map((r) => r.id);
    channels = await this.findChanelsExtendedByIds(ids, userId);
    return channels;
  },
  async findChanelsExtendedByIds(ids, userId) {
    let channels = null;
    try {
      channels = await models.Channel.findAll({
        where: {
          id: { [sequelize.Op.in]: ids },
        },
        attributes: ["uuId"],
        include: [
          {
            model: models.ChannelMember,
            as: "members",
            include: [
              {
                model: models.User,
                as: "user",
                attributes: ["name", "username"],
                include: [
                  {
                    model: models.UserProfile,
                    as: "profile",
                    attributes: [
                      "profileImageUrl",
                      "description",
                      "gender",
                      "interestedInGender",
                      "languageCode",
                      "countryCode",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      if (channels != null) {
        var tmpChannels = [];
        for (channel of channels) {
          var msgs = await models.sequelize.query(
            `SELECT *
            FROM (
            SELECT 
              m.uuId,
              m.createdAt,
              m.content,
              m.seen,
              m.isEmojiMessage,
              case when userId = :userId then 1 else 0 end as isMine
             FROM channels ch
              left join messages m
                on ch.id = m.channelId
              where ch.uuId = :uuId
              and (userId = :userId && receiverId is null || receiverId = :userId)
              and m.id > (select ifnull(MAX(id),0) from messages where seen = 1)
                                                
            UNION 

            SELECT *
            FROM
            (
                SELECT 
                  m.uuid,
                  m.createdAt,
                  m.content,
                  m.seen,
                  m.isEmojiMessage,
                  case when userId = :userId then 1 else 0 end as isMine
                from channels ch
                left join messages m 
                  on ch.id = m.channelId
                where ch.uuid = :uuId
                and (userId = :userId && receiverId is null || receiverId = :userId)
                ORDER BY m.id DESC
                LIMIT 10
            )T)T1 ORDER BY T1.createdAt asc`,
            {
              model: models.Message,
              mapToModel: true,
              replacements: { uuId: channel.uuId, userId: userId },
              type: sequelize.QueryTypes.SELECT,
            }
          );
          channel.setDataValue("messages", msgs);
          tmpChannels.push(channel);
        }
        channels = tmpChannels;
      }
    } catch (ex) {
      console.log(ex);
    }
    return channels;
  },

  async findChannelForUsers(userId1, userId2) {
    let res = await models.sequelize.query(
      `
        SELECT cm1.channelId
        FROM ChannelMembers cm1
        LEFT JOIN (SELECT channelId FROM ChannelMembers WHERE userId = :userId2) cm2
          on cm1.channelId = cm2.channelId 
        WHERE userId = :userId1 AND cm2.channelId is not null 
        limit 1
      `,
      {
        replacements: { userId1: userId1, userId2: userId2 },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    let ids = res.map((r) => r.channelId);
    let channel = null;
    channel = await this.findChanelsExtendedByIds(ids);
    if (channel != null && channel.length > 0) {
      return channel[0];
    }
    return null;
  },
  async findChannelIdsForUser(userId) {
    let res = await models.sequelize.query(
      `
        SELECT DISTINCT C.uuId
        FROM Channels C
        LEFT JOIN ChannelMembers CM
          ON C.id = CM.channelId
        WHERE CM.userId = :userId
      `,
      {
        replacements: { userId: userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    let ids = res.map((r) => r.uuId);
    return ids;
  },
  async getChannelMessages(userId, channelUuid, lastMessageTime) {
    var channel = await models.Channel.findOne({
      where: {
        uuId: channelUuid,
      },
    });
    if (!channel) {
      return null;
    }
    var messages = await models.Message.findAll({
      where: {
        channelId: channel.id,
        createdAt: { [sequelize.Op.lt]: lastMessageTime },
        [sequelize.Op.or]: [
          { [sequelize.Op.and]: [{ userId: userId }, { receiverId: null }] },
          { receiverId: userId },
        ],
      },
      attributes: [
        "uuId",
        "content",
        "createdAt",
        "seen",
        "isEmojiMessage",
        models.sequelize.literal([
          `case when 'userId' = ${userId} then true else false end as isMine`,
        ]),
      ],
      limit: 10,
      order: [["id", "DESC"]],
    });
    if (messages != null) {
      messages = _.orderBy(messages, ["createdAt"], ["asc"]);
    }
    return messages;
  },
};
