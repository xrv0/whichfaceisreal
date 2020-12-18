const express = require("express");
const bodyParser = require('body-parser')
const path = require("path");

const imageServerRouter = require("./routers/image-server-router");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(imageServerRouter);

app.use(express.static(path.join(__dirname, "../public")))

app.listen(port, () => {
    console.log("Listening on port " + port);
});
