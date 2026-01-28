const express = require('express');
const router = express.Router();

// Données simulées
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Route GET pour obtenir tous les utilisateurs
router.get('/', (req, res) => {
  res.json(users);
});


// Route GET pour obtenir un utilisateur par ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('Utilisateur non trouvé');
  res.json(user);
});


// Route POST pour ajouter un utilisateur
router.post('/', (req, res) => {
  const { name } = req.body;
  const user = {
    id: users.length + 1,
    name
  };
  users.push(user);
  res.status(201).json(user);
});

// Route PUT pour mettre à jour un utilisateur
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('Utilisateur non trouvé');
  user.name = req.body.name;
  res.json(user);
});

// Route DELETE pour supprimer un utilisateur
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Utilisateur non trouvé');
  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;