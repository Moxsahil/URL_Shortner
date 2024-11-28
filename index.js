const express = require("express");

const path = require("path");

const cookieParser = require("cookie-parser");

const { connectMongoDB } = require("./connect");

const { restrictToLoggedinUserOnly } = require("./middlewares/auth")

const urlRoute = require("./routes/url");

const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const URL = require("./models/url");

const app = express();

const PORT = 8001;

connectMongoDB("mongodb://127.0.0.1:27017/Short-url")
.then(() => console.log("connection successful"))
.catch((err) => console.log(" There is a error no connection" , err));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

app.get('/test', async  (req, res) => {
    const allUrls = await  URL.find({});
    return res.render("home", {
        urls: allUrls,
    });
})

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry =await URL.findOneAndUpdate({shortId: shortId}, {$push: {visitHistory: {
        timestamp: Date.now(),
    }}});
     res.redirect(entry.redirectURL);
})

app.listen(PORT, ()=> console.log(`server is working at ${PORT}`))