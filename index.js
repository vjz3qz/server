const express = require("express");
const app = express();

app.get("/api", (req, res) => {
    res.send("hello");
});

app.listen(1234);