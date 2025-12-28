const kafka = require('./kafka');

async function ensureTopic(topicName, partitions = 1, replicationFactor = 2) {
  const admin = kafka.admin();

  try {
    await admin.connect();
    console.log(`✅ Admin client connected to MSK cluster`);

    // Check if topic exists
    const topics = await admin.fetchTopicMetadata({ topics: [topicName] });
    
    if (topics.topics.length === 0 || topics.topics[0].name !== topicName) {
      console.log(`📝 Topic '${topicName}' does not exist. Creating...`);
      
      try {
        await admin.createTopics({
          topics: [
            {
              topic: topicName,
              numPartitions: partitions,
              replicationFactor: replicationFactor,
              configEntries: [
                { name: 'retention.ms', value: '604800000' } // 7 days
              ]
            }
          ],
          validateOnly: false,
          timeout: 30000
        });
        console.log(`✅ Topic '${topicName}' created successfully`);
      } catch (error) {
        if (error.code === 36) { // TopicAlreadyExists
          console.log(`✅ Topic '${topicName}' already exists`);
        } else {
          throw error;
        }
      }
    } else {
      console.log(`✅ Topic '${topicName}' already exists`);
      const topicMetadata = topics.topics[0];
      console.log(`   Partitions: ${topicMetadata.partitions.length}, Replication Factor: ${topicMetadata.partitions[0]?.replicas.length || 'N/A'}`);
    }
  } catch (error) {
    console.error(`❌ Error managing topic: ${error.message}`, error);
    throw error;
  } finally {
    await admin.disconnect();
  }
}

module.exports = ensureTopic;
