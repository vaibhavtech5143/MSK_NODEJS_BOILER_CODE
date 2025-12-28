const kafka = require("./kafka");

async function consume(topic = "mView-events", groupId = "mview-consumer-group") {
  const consumer = kafka.consumer({ 
    groupId: groupId,
    sessionTimeout: 30000,
    heartbeatInterval: 3000
  });

  try {
    await consumer.connect();
    console.log(`✅ Consumer connected to MSK cluster with group ID: ${groupId}`);

    await consumer.subscribe({ topic: topic, fromBeginning: false });
    console.log(`✅ Subscribed to topic: ${topic}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageValue = message.value.toString();
          console.log(`📨 Message received from ${topic}[${partition}]: ${messageValue}`);
          
          // Parse JSON if applicable
          try {
            const parsedValue = JSON.parse(messageValue);
            console.log(`   📊 Parsed data:`, parsedValue);
          } catch (e) {
            // Not JSON, just use raw value
          }
        } catch (error) {
          console.error(`❌ Error processing message: ${error.message}`);
        }
      }
    });
  } catch (error) {
    console.error(`❌ Error in consumer: ${error.message}`, error);
    throw error;
  }
}

module.exports = consume;
