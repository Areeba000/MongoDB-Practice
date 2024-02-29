const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const router = require("./routes/user_routes");
const blogrouter = require("./routes/blog_routes");
const commentrouter = require("./routes/comment_routes");


app.use("/", router);
app.use("/", blogrouter);
app.use("/", commentrouter);
mongoose.connect('mongodb://localhost:27017/blogAPI');




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});