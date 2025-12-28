const kafka = require('./kafka');

async function consume(topic) {
  const consumer = kafka.consumer({ groupId: 'verify-group' });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(
        `📥 Consumed: ${message.value.toString()}`
      );
    }
  });
}

module.exports = consume;
