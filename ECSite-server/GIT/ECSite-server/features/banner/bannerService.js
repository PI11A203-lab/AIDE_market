const models = require("../../db/initializer");

exports.findAllBanners = async (limit = 2) => {
    return await models.Banner.findAll({
        limit,
        order: [["createdAt", "DESC"]],
    });
};

exports.createBanner = async ({ imageUrl, href}) => {
    return await models.Banner.create({ imageUrl, href });
};
