const UserClass = require("../UserClass");
const fs = require("fs");

// Le regiter d'un utilisateur
function RegisterUser(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  let username = req.body.username;
  let password = req.body.password;
  let users = [];

  // Recuperation fichier JSON
  const data = fs.readFileSync("tcg-api/data/users.json", "utf8");
  users = JSON.parse(data);

  // Ajout nouvel utilisateur
  const nouvelUser = new UserClass(users.length + 1, username, password);
  users.push(nouvelUser);

  // Enregistrer la nouvelle liste
  fs.writeFileSync("tcg-api/data/users.json", JSON.stringify(users));

  return res.json({ message: users });
}

/*
  fonction de login qui reçoit un username et un password, 
  vérifie les identifiants, génère un token d'authentification, 
  le stocke dans le fichier JSON et le renvoi dans la réponse.
*/ 
function Login(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  var TokenGenerator = require("token-generator")({
    salt: "le token",
    timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
  });

  let username = req.body.username;
  let password = req.body.password;
  let users = [];
  var token = TokenGenerator.generate();

  // Recuperation fichier JSON
  const data = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(data);

  // Vérification des identifiants
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    return res.status(401).json({ message: "Erreur : Identifiants invalides" });
  }

  // On stocke le token dans le fichier pour pouvoir ensuite le révoquer (déconnexion)
  user.token = token;
  fs.writeFileSync("tcg-api/data/users.json", JSON.stringify(users));

  return res.json({ message: "Authentification réussie", data: token });
}


//La fonction recoit un token et récupère l’utilisateur correspondant, puis le renvoi dans la réponse.

function User(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }
  
  let token = req.body.token;
  let users = [];

  // Recuperation fichier JSON
  const data = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(data);

  // Ici, on simule la récupération de l'utilisateur à partir du token.
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

  // Recuperation fichier JSON
  const data = fs.readFileSync("tcg-api/data/users.json");
  users = JSON.parse(data);

  // On cherche l'utilisateur ayant ce token (ajouté pendant le login)
  const user = users.find((u) => u.token === token);
  if (!user) {
    return res.status(401).json({ message: "Erreur : Token invalide" });
  }

  // On efface simplement le token et on sauvegarde le fichier
  user.token = null;
  fs.writeFileSync("tcg-api/data/users.json", JSON.stringify(users));

  return res.json({ message: "Déconnexion réussie" });
}

module.exports = { RegisterUser, Login, User, Desconnect };
