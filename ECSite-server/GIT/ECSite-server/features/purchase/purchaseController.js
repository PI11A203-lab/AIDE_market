const purchaseService = require("./purchaseService");

exports.purchaseProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await purchaseService.purchaseProduct(id);
        res.send({ result: true });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message || "購入処理にエラーが発生しました");
    }
};
