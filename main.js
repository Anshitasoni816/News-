const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const connectFlash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const router = require("./routes/router.js");

const app = express();

dotenv.config({ path: ".env" });

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(expressSession({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}));
app.use(connectFlash());
app.use(fileUpload({ useTempFiles: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/", router);
const PORT = 8000;

(async () => {
    try {

        app.listen(PORT, () => { console.log(`Server started at port ${PORT}`) })
    } catch (error) {
        console.log(error.message);
    }
})()

