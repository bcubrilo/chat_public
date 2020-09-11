const models = require("./../models");
const sequelize = require("sequelize");
module.exports = {
  async getPostById(id) {
    var post = await models.Post.FindOne({
      where: {
        id: id,
      },
    });
  },
  async getPostExtendedById(id) {
    var post = await models.sequelize.query(
      `
        SELECT 
          p.id,
          p.content,
          p.createdAt,
          p.parentPostId,
          u.username,
          u.name,
          up.profileImageUrl,
          (select count(*) from posts where parentPostId = p.id) as commentsCount
        FROM posts p
        left join users u 
          on p.userId = u.id
        left join userprofiles up
          on u.id = up.userId
        where p.id = :postId
    `,
      { type: sequelize.QueryTypes.SELECT, replacements: { postId: id } }
    );
    return post && post.length > 0 ? post[0] : null;
  },
  async getPostTree(id) {
    var post = null;
    try {
      post = await models.sequelize.query(
        `with recursive cte (id, content, parentPostId, userId, createdAt) as (
                            select     id,
                                      content,
                                      parentPostId,
                                      userId,
                                      createdAt
                            from       posts 
							where      id = :id
                            union all
                            select     p.id,
                                      p.content,
                                      p.parentPostId,
                                      p.userId,
                                      p.createdAt
                            from       posts p
                            inner join cte
                                    on p.parentPostId = cte.id
                          )
                          select cte.*,u.name,u.username, up.profileImageUrl  
                          from cte
                          left join users u on cte.userId = u.id
                          left join userprofiles up on u.id = up.userid;`,
        { type: sequelize.QueryTypes.SELECT, replacements: { id: id } }
      );
    } catch (error) {}
    return post;
  },
  async getPostWithComments(postId) {
    var post = await models.sequelize.query(
      `SELECT 
          p.id,
          p.content,
          p.createdAt,
          null as parentPostId,
          u.username,
          u.name,
          up.profileImageUrl,
          0 as commentsCount
        FROM posts p
        left join users u 
          on p.userId = u.id
        left join userprofiles up
          on u.id = up.userId
        where p.id = :postId
      union all 
        select
		      p.id,
          p.content,
          p.createdAt,
          p.parentPostId,
          u.username,
          u.name,
          up.profileImageUrl,
          (select count(*) from posts where parentPostId = p.id) as commentsCount
        FROM posts p
        left join users u 
          on p.userId = u.id
        left join userprofiles up
          on u.id = up.userId
        where p.parentPostId = :postId
    `,
      { type: sequelize.QueryTypes.SELECT, replacements: { postId: postId } }
    );
    return post;
  },
  async getPostsTreesByUserID(userId) {
    var posts = null;
    try {
      posts = await models.sequelize.query(
        `with recursive cte (id, content, parentPostId, userId, createdAt) as (
                            select     id,
                                      content,
                                      parentPostId,
                                      userId,
                                      createdAt
                            from       posts 
							where      userId=:userId
                            union all
                            select     p.id,
                                      p.content,
                                      p.parentPostId,
                                      p.userId,
                                      p.createdAt
                            from       posts p
                            inner join cte
                                    on p.parentPostId = cte.id
                          )
                          select cte.*,u.name,u.username, up.profileImageUrl  
                          from cte
                          left join users u on cte.userId = u.id
                          left join userprofiles up on u.id = up.userid;`,
        { type: sequelize.QueryTypes.SELECT, replacements: { userId: userId } }
      );
    } catch (error) {}
    return posts;
  },
  async getRecentPosts(userId, time) {
    var posts = [];
    try {
      posts = await models.sequelize.query(
        `             select 
                      p.id,
                      p.content,
                      p.createdAt,
                      u.username,
                      u.name,
                      up.profileImageUrl
                    from profilelikes T
                    join posts p
                      on t.userId = p.userId
                    join users u
                      on p.userId = u.id
                    left join userprofiles up
                      on u.id = up.userId
                    where T.userId =:userId and p.parentPostId is null and (:time is null or p.createdAt > :time)
                    order by p.createdAt asc`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { userId: userId, time: time },
        }
      );
    } catch (error) {
      console.log("Error happend", error);
    }

    return posts;
  },
  async getPostComments(postId) {
    var post = await models.sequelize.query(
      `SELECT
		      p.id,
          p.content,
          p.createdAt,
          u.username,
          u.name,
          up.profileImageUrl,
          (select count(*) from posts where parentPostId = p.id) as commentsCount
        FROM posts p
        left join users u 
          on p.userId = u.id
        left join userprofiles up
          on u.id = up.userId
        where p.parentPostId = :postId
    `,
      { type: sequelize.QueryTypes.SELECT, replacements: { postId: postId } }
    );
    return post;
  },
  async getPostsByUserId(userId) {
    var posts = [];
    try {
      posts = await models.sequelize.query(
        `             select 
                      p.id,
                      p.content,
                      p.createdAt,
                      u.username,
                      u.name,
                      up.profileImageUrl
                    from posts p
                    join users u
                      on p.userId = u.id
                    left join userprofiles up
                      on u.id = up.userId
                    where p.parentPostId is null and p.userId = :userId
                    order by p.createdAt asc`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { userId: userId },
        }
      );
    } catch (error) {
      console.log("Error happend", error);
    }

    return posts;
  },
  async search(keywords, dateFrom, dateTo) {
    var posts = [];
    if (!dateFrom) dateFrom = null;
    if (!dateTo) dateTo = null;
    try {
      posts = await models.sequelize.query(
        `             select 
                      p.id,
                      p.content,
                      p.createdAt,
                      u.username,
                      u.name,
                      up.profileImageUrl
                    from posts p
                    join users u
                      on p.userId = u.id
                    left join userprofiles up
                      on u.id = up.userId
                    where match(p.content) against(:keywords)
                      AND (:dateFrom is null OR p.createdAt>= :dateFrom)
                      AND (:dateTo is null OR p.createdAt <= :dateTo)
                    order by p.createdAt desc`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: {
            keywords: keywords,
            dateFrom: dateFrom,
            dateTo: dateTo,
          },
        }
      );
    } catch (error) {
      console.log("Error happend", error);
    }

    return posts;
  },
};
