const express = require("express");
const upload = require("./upload");

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).send({ error: "ファイルがありません" });
    res.send({ imageUrl: `uploads/${req.file.filename}` });
});

module.exports = router;
