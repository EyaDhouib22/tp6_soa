const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Assurez-vous que Kafka tourne sur ce port
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  console.log("Producer connected");

  let i = 0;
  setInterval(async () => {
    try {
      const messageContent = `Hello KafkaJS user! Message #${i++}`;
      await producer.send({
        topic: 'test-topic',
        messages: [
          { value: messageContent },
        ],
      });
      console.log(`Message produit avec succès: ${messageContent}`);
    } catch (err) {
      console.error("Erreur lors de la production de message", err);
    }
  }, 1000); // Envoie un message toutes les secondes
};

runProducer().catch(err => {
    console.error("Erreur dans le producer:", err);
    producer.disconnect();
    process.exit(1);
});