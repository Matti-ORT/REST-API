const fs = require("fs");

// Fonction pour récupérer toutes les cartes
function GetAllCards(req,res) {
    let cards = [];

    const data = fs.readFileSync("tcg-api/data/cards.json");
    cards = JSON.parse(data);

    return res.json({ message: cards });
}


function OpenBooster(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  // Recuperation fichier JSON des utilisateurs
  const dataUser = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(dataUser);

  // On cherche l'utilisateur ayant ce token
  const user = users.find((u) => u.token === req.body.token);
  if (!user) {
    return res.status(401).json({ message: "Erreur : Token invalide" });
  }

  // --- Délai entre boosters / delay between boosters ---
  const now = Date.now();
  const delay = 5 * 60 * 1000; // 5 minutes en millisecondes

  // si l'utilisateur a déjà ouvert un booster, vérifier le délai
  if (user.lastBooster && now - user.lastBooster < delay) {
    const remaining = Math.ceil((delay - (now - user.lastBooster)) / 1000);
    // message simple en français/anglais minimal
    return res.status(429).json({
      message: `Veuillez attendre encore ${remaining} secondes avant d'ouvrir un nouveau booster / please wait ${remaining} seconds before opening another booster`,
    });
  }

  // on peut ouvrir un booster, on met à jour la date
  user.lastBooster = now;
  fs.writeFileSync("tcg-api/data/users.json", JSON.stringify(users, null, 2));

  let cards = [];
  const data = fs.readFileSync("tcg-api/data/cards.json");
  cards = JSON.parse(data);

  // Simuler l'ouverture d'un booster en sélectionnant aléatoirement 5 cartes
  const boosterCards = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    boosterCards.push(cards[randomIndex]);
  }

  return res.json({ message: "Booster ouvert avec succès", data: boosterCards });
}

module.exports = {GetAllCards, OpenBooster};