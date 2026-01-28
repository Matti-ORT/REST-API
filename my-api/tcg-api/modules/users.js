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
  const data = fs.readFileSync("./my-api/tcg-api/data/users.json","utf8");
  users = JSON.parse(data);

  // Ajout nouvel utilisateur
  const nouvelUser = new UserClass(users.length + 1, username, password);
  users.push(nouvelUser);

  // Enregistrer la nouvelle liste
  fs.writeFileSync("./my-api/tcg-api/data/users.json", JSON.stringify(users));
  



  return res.json({ message : users });
}


function Login(req, res) {
  if (!req.body) {
    res.status(400).json({ message: "Erreur : Aucune données" });
    return;
  }

  var TokenGenerator = require('token-generator' )({
        salt: 'le token',
        timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes
    });

  let username = req.body.username;
  let password = req.body.password;
  let users = [];
  var token = TokenGenerator.generate();  

  // Recuperation fichier JSON
  const data = fs.readFileSync("./my-api/tcg-api/data/users.json");
  users = JSON.parse(data);

  // Verification des identifiants
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message : "Erreur : Identifiants invalides" });
  }

  return res.json({ message : "Athantification reussi", data: token });

}
module.exports = { RegisterUser, Login };
