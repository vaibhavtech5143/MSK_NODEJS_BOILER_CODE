const { Kafka } = require('kafkajs');
const { createKafkaIamAuthenticator } = require('@aws-msk-iam-sasl-signer');

const kafka = new Kafka({
  clientId: 'msk-auto-verify-app',
  brokers: [
    'b-2.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9098',
    'b-1.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9098'
  ],
  ssl: true,
  sasl: createKafkaIamAuthenticator({
    region: 'ap-south-1'
  })
});

module.exports = kafka;
