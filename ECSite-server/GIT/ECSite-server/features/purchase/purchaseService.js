const models = require("../../db/initializer");

exports.purchaseProduct = async (id) => {
    // 商品が存在するか確認
    const product = await models.Product.findOne({ where: { id } });
    if (!product) throw new Error("商品が見つかりません");

    // 売り切れチェック
    if (product.soldout) throw new Error("すでに売り切れです");

    // soldout フラグを更新
    return await models.Product.update({ soldout: true }, { where: { id } });
};
