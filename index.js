const ensureTopic = require('./topic');
const produce = require('./producer');
const consume = require('./consumer');

// Default topic name for your mView client
const TOPIC = 'my-first-topic';

async function start() {
  try {
    console.log('🚀 Starting MSK Node.js Boilerplate...\n');

    // Step 1: Ensure topic exists
    console.log('Step 1: Ensuring topic exists');
    await ensureTopic(TOPIC);
    console.log('');

    // Step 2: Produce a sample message
    console.log('Step 2: Producing sample message');
    await produce(TOPIC);
    console.log('');

    // Step 3: Start consumer to read messages
    console.log('Step 3: Starting consumer (listening for messages...)');
    await consume(TOPIC);
  } catch (error) {
    console.error('❌ Startup failed', error);
    process.exit(1);
  }
}

start();
