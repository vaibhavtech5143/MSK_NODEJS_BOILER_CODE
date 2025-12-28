const { Kafka } = require("kafkajs");
const { generateAuthToken } = require("aws-msk-iam-sasl-signer-js");

// AWS Region for IAM token generation
const AWS_REGION = "ap-south-1";

// MSK Cluster Bootstrap Servers (Private VPC endpoints with IAM authentication)
// Use these if your EC2 is in the same VPC as MSK cluster
const BROKERS = [
  "b-1.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9098",
  "b-2.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9098"
];

// If connecting from outside AWS or different VPC, use public endpoints:
// "b-1-public.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9198"
// "b-2-public.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9198"

// IAM OAuth Bearer Token Provider
async function oauthBearerTokenProvider(region) {
  try {
    const { token } = await generateAuthToken({ region });
    return {
      value: token
    };
  } catch (error) {
    console.error('Error generating IAM token:', error);
    throw error;
  }
}

// Initialize Kafka client with IAM authentication
const kafka = new Kafka({
  clientId: "msk-node-app",
  brokers: BROKERS,
  ssl: true,
  sasl: {
    mechanism: "oauthbearer",
    oauthBearerProvider: () => oauthBearerTokenProvider(AWS_REGION)
  },
  connectionTimeout: 10000,
  requestTimeout: 30000,
  retries: {
    initialRetryTime: 100,
    retries: 8
  }
});

module.exports = kafka;
