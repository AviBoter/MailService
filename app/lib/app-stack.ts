import * as cdk from "aws-cdk-lib";
import * as apiGateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apiGatewayAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { UserPoolStack } from "./userPoolStack";
import { EmailServiceStack } from "./emailServiceStack";

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPoolStack = new UserPoolStack(this, "UserPoolStack");

    const authorizer = new apiGatewayAuthorizers.HttpUserPoolAuthorizer(
      "authorizer",
      userPoolStack.userPool,
      {
        userPoolClients: [userPoolStack.userPoolClient],
        identitySource: ["$request.header.Authorization"],
      }
    );

    const api = new apiGateway.HttpApi(this, "api", {
      apiName: `send-email-api`,
    });

    const emailService = new EmailServiceStack(this, "EmailService", {
      authorizer,
      api,
    });

    new cdk.CfnOutput(this, "region", { value: cdk.Stack.of(this).region });
    new cdk.CfnOutput(this, "userPoolId", {
      value: userPoolStack.userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "userPoolClientId", {
      value: userPoolStack.userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "apiUrl", {
      value: api.url!,
    });
  }
}
