import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGatewayAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import * as apiGateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apiGatewayIntegrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as sns from "aws-cdk-lib/aws-sns";
import * as iam from "aws-cdk-lib/aws-iam";

export interface EmailServiceProps {
  api: apiGateway.HttpApi;
  authorizer: apiGatewayAuthorizers.HttpUserPoolAuthorizer;
}

export class EmailServiceStack extends Construct {
  constructor(scope: Construct, id: string, props: EmailServiceProps) {
    super(scope, id);

    const auth = props.authorizer;

    const sendMailRole = new iam.Role(this, "SendMailRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    sendMailRole.attachInlinePolicy(
      new iam.Policy(this, "Send-Mail-Policy", {
        statements: [
          new iam.PolicyStatement({
            actions: [
              "SNS:Subscribe",
              "SNS:Publish",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
            resources: ["*"],
          }),
        ],
      })
    );

    const topic = new sns.Topic(this, "sns-topic", {
      displayName: "My SNS topic",
    });

    var lambdaFunc = new lambda.Function(this, "SendMail", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "sendMail.handler",
      code: lambda.Code.fromAsset("lambda"),
      role: sendMailRole,
      environment: {
        topicArn: topic.topicArn,
      },
    });

    props.api.addRoutes({
      integration: new apiGatewayIntegrations.HttpLambdaIntegration(
        "lambda-protected",
        lambdaFunc
      ),
      path: "/send",
      methods: [apiGateway.HttpMethod.POST],
      //authorizer: auth,
    });

    new cdk.CfnOutput(this, "snsTopicArn", {
      value: topic.topicArn,
      description: "The arn of the SNS topic",
    });
  }
}
