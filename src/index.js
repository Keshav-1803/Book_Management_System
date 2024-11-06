const express = require("express");
const route = require("/routes/route.js");
const {default: mongoose, mongo} = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());

mongoose.connect(process.env.mongoDBConnectionString).then(() => console.log("MongoDB (Database) is connected...")).catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 8001, () => {
   console.log("Express App is working at PORT ", process.env.PORT || 8001);
})