const kafka = require("./kafka");

async function produce(topic = "mView-events", messages = null) {
  const producer = kafka.producer();

  try {
    await producer.connect();
    console.log("✅ Producer connected to MSK cluster");

    const defaultMessages = messages || [
      { value: JSON.stringify({ event: "app_start", timestamp: new Date().toISOString(), data: "Hello MSK IAM 🚀" }) }
    ];

    const result = await producer.send({
      topic: topic,
      messages: defaultMessages,
      timeout: 30000
    });

    console.log(`✅ Message sent to topic '${topic}':`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error producing message: ${error.message}`, error);
    throw error;
  } finally {
    await producer.disconnect();
  }
}

module.exports = produce;
