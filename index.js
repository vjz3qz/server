const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to database
mongoose.connect('mongodb://localhost:27017/my_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error(err);
  });


app.get("/api", (req, res) => {
    res.send("hello");
});

app.listen(1234);

