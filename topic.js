const kafka = require('./kafka');

async function ensureTopic(topic) {
  const admin = kafka.admin();
  await admin.connect();

  const topics = await admin.listTopics();

  if (!topics.includes(topic)) {
    console.log(`🚀 Creating topic: ${topic}`);

    await admin.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic,
          numPartitions: 3,
          replicationFactor: 3
        }
      ]
    });

    console.log(`✅ Topic created`);
  } else {
    console.log(`ℹ️ Topic already exists`);
  }

  await admin.disconnect();
}

module.exports = ensureTopic;
