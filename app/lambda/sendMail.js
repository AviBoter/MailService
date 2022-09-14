const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

exports.handler = async function (event) {
  const body = JSON.parse(event.body);
  var sum = Number(body.num1) + Number(body.num2);

  var params = {
    Message: String(sum),
    TopicArn: process.env.topicArn,
  };

  await new AWS.SNS({ apiVersion: "2010-03-31" }).publish(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(sum),
  };
};
