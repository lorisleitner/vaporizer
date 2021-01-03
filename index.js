const express = require("express");

const app = express();

app.use(express.static("public"));

app.post("/vaporize", (req, res) => {
    //res.download(req.files["file"].tempFilePath, req.files["file"].name);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Vaporizer running on port ${port}`);
});