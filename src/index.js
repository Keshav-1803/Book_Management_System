const express = require("express");
const route = require("./routes/route");
const mongoose = require("mongoose");  // Direct import of mongoose (not default and named destructuring)
const app = express();

// Load environment variables from the .env file
require("dotenv").config();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB (Database) is connected..."))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Use routes from the route file
app.use("/", route);

// Start Express server
const port = process.env.PORT || 8001;
app.listen(port, () => {
   console.log(`Express App is working at PORT ${port}`);
});
