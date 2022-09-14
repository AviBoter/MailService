# Welcome to MailService project

This is a simple project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Require Steps
  
1 - open Terminal and run 'npm install' in app folder.  

2 - Run  'cdk bootstrp'

3 - Run  'cdk deploy'


4 - choose 2 numbers (num1 & num2) and run:

'curl --location --request POST 'https://0n37jw61eb.execute-api.us-east-1.amazonaws.com/send' \ --header 'Content-Type: application/json' \--data-raw '{

    "num1": "Write An Int Number here!",
    "num2": "Write An Int Number here!"
    
}''

Note: you must subscribe your email address to the sns service in order to recive an email with the sum of the two numbers.
