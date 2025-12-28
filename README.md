# AWS MSK Node.js Boilerplate

A complete Node.js boilerplate for connecting to AWS Managed Streaming for Apache Kafka (MSK) with IAM authentication.

## Prerequisites

1. **AWS Account** with MSK cluster configured
2. **Node.js** (v14 or higher)
3. **AWS Credentials** configured on your machine
   - Set up via AWS CLI: `aws configure`
   - Or use IAM roles/policies if running in AWS environment

## Cluster Information

**Cluster Name**: dev-msk-cluster-ns  
**Kafka Version**: 3.6.0  
**Region**: ap-south-1  
**Authentication**: IAM role-based  
**Encryption**: TLS enabled  

### Bootstrap Servers

- **Private (IAM)**: `b-1.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9098,b-2.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9098`
- **Public (IAM)**: `b-1-public.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9198,b-2-public.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com:9198`

## Installation

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install:
   - `kafkajs` - Kafka client for Node.js
   - `aws-msk-iam-sasl-signer-js` - IAM SASL authentication for MSK

3. **Configure AWS Credentials**:
   ```bash
   aws configure
   ```
   
   Or set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your-key-id
   export AWS_SECRET_ACCESS_KEY=your-secret-key
   export AWS_DEFAULT_REGION=ap-south-1
   ```

4. **Verify credentials** (optional):
   ```bash
   aws sts get-caller-identity
   ```

## Usage

### Running the Complete Pipeline

```bash
npm start
```

This will:
1. ✅ Ensure the `mView-events` topic exists
2. ✅ Produce a sample message
3. ✅ Start a consumer to listen for messages

### Using Individual Components

#### Producer Only

```javascript
const produce = require('./producer');

// Send message to default topic
await produce('mView-events', [
  { value: JSON.stringify({ event: 'test', data: 'Hello MSK' }) }
]);

// Or use with custom topic
await produce('custom-topic', [
  { value: 'Your message here' }
]);
```

#### Consumer Only

```javascript
const consume = require('./consumer');

// Listen to messages from default topic
await consume('mView-events', 'my-consumer-group');

// Or use with custom topic
await consume('custom-topic', 'my-consumer-group');
```

#### Topic Management

```javascript
const ensureTopic = require('./topic');

// Create or verify topic exists
await ensureTopic('my-topic', 1, 2); // name, partitions, replication factor
```

## File Structure

- **kafka.js** - Kafka client initialization with IAM authentication
- **producer.js** - Message producer utility
- **consumer.js** - Message consumer utility
- **topic.js** - Topic management utility
- **index.js** - Main application entry point
- **package.json** - Project dependencies
- **.env.example** - Environment variable reference

## IAM Authentication

This boilerplate uses **IAM role-based authentication** for MSK. The `aws-msk-iam-sasl-signer-js` library automatically handles:
- Token generation using your AWS credentials
- SASL/OAUTHBEARER authentication mechanism
- Token refresh

### Required IAM Permissions

Ensure your IAM user/role has these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kafka-cluster:Connect",
        "kafka-cluster:AlterCluster",
        "kafka-cluster:DescribeCluster"
      ],
      "Resource": "arn:aws:kafka:ap-south-1:387283380836:cluster/dev-msk-cluster-ns/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "kafka-cluster:*Topic*",
        "kafka-cluster:WriteData",
        "kafka-cluster:ReadData"
      ],
      "Resource": "arn:aws:kafka:ap-south-1:387283380836:topic/dev-msk-cluster-ns/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "kafka-cluster:AlterGroup",
        "kafka-cluster:DescribeGroup"
      ],
      "Resource": "arn:aws:kafka:ap-south-1:387283380836:group/dev-msk-cluster-ns/*"
    }
  ]
}
```

## Troubleshooting

### Connection Issues

1. **Check AWS Credentials**:
   ```bash
   aws sts get-caller-identity
   ```

2. **Verify Security Group**:
   - Ensure security group `sg-0427f9f47ed97995c` allows outbound traffic on port 9198

3. **Check Network Connectivity**:
   ```bash
   telnet b-1-public.devmskclusterns.rtzs78.c2.kafka.ap-south-1.amazonaws.com 9198
   ```

### Authentication Errors

- Verify IAM permissions are correctly configured
- Ensure AWS credentials are fresh and valid
- Check that the IAM SASL signer library is installed: `npm ls aws-msk-iam-sasl-signer-js`

### Message Not Appearing

- Verify the topic name matches in producer and consumer
- Check consumer group is correct
- Try consuming from beginning: `await consume(topic, groupId, true)`

## Configuration Reference

Edit `kafka.js` to customize:

- **Brokers**: Change bootstrap server endpoints
- **Client ID**: Modify `clientId` for different applications
- **Timeouts**: Adjust `connectionTimeout` and `requestTimeout`
- **Retries**: Configure `retries` for connection resilience

## Security Best Practices

1. ✅ **Use IAM Authentication** - This boilerplate uses IAM roles (no passwords)
2. ✅ **Enable TLS** - All connections are encrypted (enabled by default)
3. ✅ **Secure Credentials** - Use AWS IAM roles instead of long-term keys
4. ✅ **Restrict Permissions** - Apply least-privilege IAM policies
5. ✅ **Monitor Access** - Use CloudWatch and MSK metrics
6. ✅ **Enable Audit Logs** - Configure CloudWatch Logs for broker activity

## Performance Tips

1. **Batch Messages**: Send multiple messages in a single `producer.send()` call
2. **Tune Partitions**: Use multiple partitions for parallel processing
3. **Consumer Groups**: Use consumer groups to scale message processing
4. **Compression**: Enable compression for large payloads
5. **Batch Size**: Adjust batch size in producer configuration

## Resources

- [KafkaJS Documentation](https://kafka.js.org/)
- [AWS MSK Documentation](https://docs.aws.amazon.com/msk/)
- [AWS MSK IAM Auth](https://docs.aws.amazon.com/msk/latest/developerguide/iam-access-control.html)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)

## License

ISC

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review AWS MSK documentation
3. Check KafkaJS GitHub issues
4. Review AWS MSK IAM authentication guide
