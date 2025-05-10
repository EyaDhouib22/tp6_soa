const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');

// Configuration Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'test-group-db' }); // Groupe différent si vous voulez relire les messages

// Configuration MongoDB
const mongoUri = 'mongodb://localhost:27017'; // URI de connexion MongoDB
const dbName = 'kafka_tp_db';
const collectionName = 'messages';
const client = new MongoClient(mongoUri);

async function saveToMongoDB(messageData) {
  try {
    await client.connect(); // Assurez-vous que le client est connecté
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(messageData);
    console.log(`Message enregistré dans MongoDB avec id: ${result.insertedId}`);
  } catch (err) {
    console.error('Erreur lors de l_enregistrement dans MongoDB:', err);
  }
  // Ne pas fermer la connexion ici si vous réutilisez le client pour plusieurs messages
  // client.close(); // Fermez la connexion globalement à la fin ou sur une erreur fatale
}

const runConsumerAndSave = async () => {
  await client.connect(); // Connexion MongoDB au démarrage du consommateur
  console.log("Connecté à MongoDB");

  await consumer.connect();
  console.log("Consumer connected to Kafka");
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
  console.log("Subscribed to topic: test-topic");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const consumedMessage = {
        topic,
        partition,
        offset: message.offset,
        timestamp: message.timestamp,
        value: message.value.toString(),
        receivedAt: new Date() // Ajout d'un timestamp de réception
      };
      console.log('Message reçu par Kafka:', consumedMessage);
      await saveToMongoDB(consumedMessage);
    },
  });
};

runConsumerAndSave().catch(async err => {
    console.error("Erreur dans le consumer (DB):", err);
    await consumer.disconnect();
    await client.close(); // Assurez-vous de fermer la connexion MongoDB en cas d'erreur
    process.exit(1);
});

// Gestion de la fermeture propre
process.on('SIGINT', async () => {
  console.log("Fermeture des connexions...");
  await consumer.disconnect();
  await client.close();
  process.exit(0);
});