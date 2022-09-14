import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class UserPoolStack extends Construct {
  public userPool: cognito.UserPool;
  public userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.AppProps) {
    super(scope, id);

    // user pool
    const userPool = new cognito.UserPool(this, "userpool", {
      userPoolName: `user-pool`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    this.userPool = userPool;
    // user pool client
    const userPoolClient = new cognito.UserPoolClient(this, "client", {
      userPool,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        custom: true,
        userSrp: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    this.userPoolClient = userPoolClient;
  }
}
