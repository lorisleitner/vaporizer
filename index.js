const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {exec} = require("child_process");

const app = express();
const storage = multer.diskStorage({
    destination: "tmp/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

app.use(express.static("public"));

app.post("/vaporize", upload.single("file"),
    (req, res, next) => {
        const file = req.file;
        if (!file) {
            return res.sendStatus(400);
        }

        const outPath = `tmp/${path.basename(file.filename, path.extname(file.filename))}-vaporized.mp3`;
        exec(`sox "${file.path}" "${outPath}" speed 0.7 bass +1 treble -10`, (error, stdout, stderr) => {
            fs.unlink(file.path, (err) => {
            });

            if (error) {
                console.log("sox error: " + error);
                return res.sendStatus(400);
            }

            const downloadName = path.basename(file.originalname, path.extname(file.originalname))+ " Vaporized.mp3";
            return res.download(outPath, downloadName, (err) => {
                fs.unlink(outPath, (err) => {});
            });
        });

    });

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Vaporizer running on port ${port}`);
});