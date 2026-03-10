const fs = require("fs");

// retourne toutes les cartes
function GetAllCards(req, res) {
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

  // lire users et trouver celui du token
  const dataUser = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(dataUser);

  const user = users.find((u) => u.token === req.body.token);
  if (!user) {
    return res.status(401).json({ message: "Erreur : Token invalide" });
  }

  //Delais
  const now = Date.now();
  const delay = 5 * 60 * 1000; // 5 minutes en millisecondes

  // si l'utilisateur a deja ouvert un booster on verifie le délai
  if (user.lastBooster && now - user.lastBooster < delay) {
    return res.status(429).json({
      message: ` Attendez encore avant d'ouvrir un nouveau booster`,
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

  return res.json({
    message: "Booster ouvert avec succès",
    data: boosterCards,
  });
}

module.exports = { GetAllCards, OpenBooster };
