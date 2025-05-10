const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; // Port pour l'API

// Configuration MongoDB
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'kafka_tp_db';
const collectionName = 'messages';
const client = new MongoClient(mongoUri);

async function startApi() {
  try {
    await client.connect();
    console.log("API connectée à MongoDB");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Middleware pour parser le JSON (pas utilisé ici, mais bonne pratique)
    app.use(express.json());

    // Route pour récupérer tous les messages
    app.get('/messages', async (req, res) => {
      try {
        const messages = await collection.find({}).sort({ receivedAt: -1 }).toArray(); // Trier par date de réception, les plus récents en premier
        res.json(messages);
      } catch (err) {
        console.error("Erreur lors de la récupération des messages:", err);
        res.status(500).send("Erreur serveur");
      }
    });

    app.listen(port, () => {
      console.log(`API REST démarrée sur http://localhost:${port}`);
    });

  } catch (err) {
    console.error("Impossible de démarrer l'API ou de se connecter à MongoDB:", err);
    process.exit(1);
  }
}

startApi();

process.on('SIGINT', async () => {
  console.log("Fermeture de la connexion MongoDB de l'API...");
  await client.close();
  process.exit(0);
});