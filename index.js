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
const upload = multer({
    storage: storage
});

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", upload.single("file"),
    (req, res, next) => {
        const file = req.file;
        if (!file) {
            res.render("index", {
                errorMessage: "Please select a file"
            });
            return next();
        }

        if (file.size > 20 * 1024 * 1024) {
            res.render("index", {
                errorMessage: "File too large"
            });
            return next();
        }

        const outPath = `tmp/${path.basename(file.filename, path.extname(file.filename))}-vaporized.mp3`;
        exec(`sox "${file.path}" "${outPath}" bass +1 treble -5 reverb 50 50 100 100 10 -1 reverb 50 50 75 100 10 -1 speed 0.7`,
            (error, _, __) => {
                if (error) {
                    console.log("sox error: " + error);
                    res.render("index", {
                        errorMessage: "The file couldn't be vaporized, please try another one"
                    });
                    return next();
                }

                console.log(`Vaporized ${file.originalname}`);

                const downloadName = path.basename(file.originalname, path.extname(file.originalname)) + " vaporized.mp3";
                res.download(outPath, downloadName, async (err) => {
                    fs.unlink(outPath, err => {
                    });
                });
                return next();
            });
    });

app.use((req, res, next) => {
    ;
    if (req.file) {
        fs.unlink(req.file.path, err => {
        });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Vaporizer running on port ${port}`);
});