const ensureTopic = require('./topic');
const produce = require('./producer');
const consume = require('./consumer');

const TOPIC = 'auto-verify-topic';

async function start() {
  await ensureTopic(TOPIC);
  await produce(TOPIC);

  // Start consumer LAST so it can read everything
  await consume(TOPIC);
}

start().catch(err => {
  console.error('❌ Startup failed', err);
  process.exit(1);
});
