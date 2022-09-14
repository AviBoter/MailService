const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

exports.handler = async function (event) {
  var sum = Number(event.num1) + Number(event.num2);
  // Create publish parameters

  // Create subscribe/email parameters
  // var params = {
  //   Protocol: "EMAIL" /* required */,
  //   TopicArn: process.env.topicArn /* required */,
  //   Endpoint: "maccavi30@gmail.com",
  // };

  // // Create promise and SNS service object
  // await new AWS.SNS({ apiVersion: "2010-03-31" }).subscribe(params).promise();

  params = {
    Message: String(sum) /* required */,
    TopicArn: process.env.topicArn,
  };

  var publishTextPromise = await new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  return {
    statusCode: 200,
    body: JSON.stringify(publishTextPromise),
  };
};
