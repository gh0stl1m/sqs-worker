'use strict';

const { SQS } = require("aws-sdk");

const sqs = new SQS();

async function producer(event) {

  if (!event.body) {

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No message body found'
      })
    }
  }

  try {

    await sqs
      .sendMessage({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: event.body,
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
      .promise();
    
  } catch (err) {

     return {
      statusCode: 503,
      body: JSON.stringify({
        message: `Something went wrong ${err.message}`
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Message sent successfully'
    })
  }
}

function consumer(event) {

  for (const record of event.Records) {
    const messageAttributes = record.messageAttributes;
    console.log(
      "Message Attribute: ",
      messageAttributes.AttributeName.stringValue
    );
    console.log("Message Body: ", record.body);
  }

}

module.exports = {
  producer,
  consumer,
}
