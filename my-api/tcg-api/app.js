const express = require("express");
const app = express();
const users = require("./modules/users");
const cards = require("./modules/cards");
const port = 3001;

app.use(express.urlencoded({ extended: true }));

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.post("/desconnect", users.Desconnect);
app.post("/register", users.RegisterUser);

app.get("/login", users.Login);
app.get("/user", users.User);

app.get("/cards", cards.GetAllCards);
app.put("/booster", cards.OpenBooster);


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
