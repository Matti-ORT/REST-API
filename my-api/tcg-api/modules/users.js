const UserClass = require("../UserClass");
const fs = require("fs");

// création d'un compte
function RegisterUser(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  let username = req.body.username;
  let password = req.body.password;
  let users = [];

  const data = fs.readFileSync("tcg-api/data/users.json", "utf8");
  users = JSON.parse(data);

  const nouvelUser = new UserClass(users.length + 1, username, password);
  users.push(nouvelUser);

  fs.writeFileSync("tcg-api/data/users.json", JSON.stringify(users));

  return res.json({ message: users });
}

// authentification et génération de token
function Login(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  var TokenGenerator = require("token-generator")({
    salt: "le token",
    timestampMap: "abcdefghij",
  });

  let username = req.body.username;
  let password = req.body.password;
  let users = [];
  var token = TokenGenerator.generate();

  const data = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(data);

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    return res.status(401).json({ message: "Erreur : Identifiants invalides" });
  }

  user.token = token;
  fs.writeFileSync("tcg-api/data/users.json", JSON.stringify(users));

  return res.json({ message: "Authentification réussie", data: token });
}

// récupère l'utilisateur via token

function User(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  let token = req.body.token;
  let users = [];

  const data = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(data);

  const user = users.find((u) => u.token === token);
  if (!user) {
    return res.status(401).json({ message: "Erreur : Token invalide" });
  }

  return res.json({ message: "Utilisateur récupéré avec succès", data: user });
}

function Desconnect(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  let token = req.body.token;
  let users = [];

  const data = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(data);

  const user = users.find((u) => u.token === token);
  if (!user) {
    return res.status(401).json({ message: "Erreur : Token invalide" });
  }

  user.token = null;
  fs.writeFileSync("tcg-api/data/users.json", JSON.stringify(users));

  return res.json({ message: "Déconnexion réussie" });
}

module.exports = { RegisterUser, Login, User, Desconnect };
