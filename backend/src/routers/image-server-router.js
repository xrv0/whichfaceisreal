const { v4: uuid } = require('uuid');
const downloader = require('image-downloader')
const express = require("express");
const path = require('path');
const fs = require('fs');

const router = express.Router();

const realImagesDirectory = path.join(__dirname, "../../data/images/real");
const fakeImagesDirectory = path.join(__dirname, "../../data/images/fake");
const fakeFaceUrl = "https://thispersondoesnotexist.com/image";
const listRealImages = [];

function retrieveListOfRealImages() {
    fs.readdir(realImagesDirectory, (err, files) => {
        files.forEach(file => {
            listRealImages.push(file);
        });
    });
}

async function generateRealImage() {
    const name = listRealImages[Math.floor(Math.random()*listRealImages.length)];
    return "/images/real/" + name;
}

async function generateFakeImage() {
    const name = uuid() + ".jpg";
    const imagePath = path.join(fakeImagesDirectory, name);
    const options = {
        url: fakeFaceUrl,
        dest: imagePath
    }

    await downloader.image(options)
        .catch((err) => console.error(err));
    return "/images/fake/" + name;
}

router.get("/generate-pair", async (req, res) => {
    const realImagePath = await generateRealImage();
    const fakeImagePath = await generateFakeImage();

    res.json({
        realImage: realImagePath,
        fakeImage: fakeImagePath
    });
});

router.use("/images/real/", express.static(realImagesDirectory));
router.use("/images/fake/", express.static(fakeImagesDirectory));

retrieveListOfRealImages();
module.exports = router;
