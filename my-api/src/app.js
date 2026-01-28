const express = require('express');
const app = express();
const port = 3000;
// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});