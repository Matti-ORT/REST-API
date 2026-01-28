const express = require('express');
const app = express();
const users = require("./modules/users");
const port = 3000;


app.use(express.urlencoded({ extended: true }));



// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.post("/register", users.RegisterUser);


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});