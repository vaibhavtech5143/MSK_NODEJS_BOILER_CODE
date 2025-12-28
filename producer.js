const kafka = require('./kafka');

async function produce(topic) {
  const producer = kafka.producer();
  await producer.connect();

  for (let i = 1; i <= 3; i++) {
    await producer.send({
      topic,
      messages: [
        {
          key: `key-${i}`,
          value: `verification-message-${i}`
        }
      ]
    });

    console.log(`📤 Produced message ${i}`);
  }

  await producer.disconnect();
}

module.exports = produce;
