const express = require('express');
const app = express.Router();


app.get("/", (req, res) => { 
 res.json(
 { 
 message : "Bienvenue sur l'API TCG", 
 data : {}
 }
 );
});

module.exports = app;

app.use(express.urlencoded({ extended: true }));
