import readline from 'readline';
import { asymmetricSignature, symmetricSignature, verifyAsymmetricSignature, verifySymmetricSignature } from 'snap-bi-signer';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const rla = (query: string) => new Promise<string>((resolve) => rl.question(query, resolve));

const envVariables = {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    PRIVATE_KEY: '',
    PJP_PUBLIC_KEY: ''
};

function getUserInput() {
    checkEnvVariables();
    (async () => {
        let input = await rla(`Choose an option: \n1. Asymmetric Signature\n2. Verify Asymmetric Signature\n3. Symmetric Signature\n4. Verify Symmetric Signature\nType 'exit' to close the program\n`);
        let signature: string;
        let timestamp: string;
        let result: boolean;
        let httpMethod: string;
        let url: string;
        let body: string;
        let accessToken: string;

        switch (input) {
            case '1':
                console.log('Asymmetric Signature: \n');
                console.log(asymmetricSignature(envVariables.CLIENT_ID, envVariables.PRIVATE_KEY));
                console.log('\n');
                rl.question('Press any key to continue', () => {
                    return getUserInput();
                });
                break;
            case '2':
                console.log('Verify Asymmetric Signature: \n');
                signature = await rla('Enter the signature: ');
                timestamp = await rla('Enter the timestamp: ');
                console.log('Result: ');
                result = verifyAsymmetricSignature({clientID: envVariables.CLIENT_ID, publicKey: envVariables.PJP_PUBLIC_KEY, signature, timestamp});

                if (result) {
                    // Signature is valid with green color
                    console.log('\x1b[32m', 'Signature is valid');
                    // Reset the color
                    console.log('\x1b[0m');
                } else {
                    console.log('\x1b[31m', 'Signature is invalid')
                    console.log('\x1b[0m');
                }
                console.log('\n');
                rl.question('Press any key to continue', () => {
                    return getUserInput();
                });
                break;
            case '3':
                // Input for symmetric signature
                console.log('Symmetric Signature: \n');
                httpMethod = await rla('Enter the HTTP method: ');
                url = await rla('Enter the URL: ');
                timestamp = await rla('Enter the timestamp: ');
                body = await rla('Enter the body: ');
                accessToken = await rla('Enter the AccessToken: ');
                signature = symmetricSignature({clientSecret: envVariables.CLIENT_SECRET, httpMethod, relativeUrl: url, timestamp, requestBody: JSON.parse(body), accessToken});

                console.log('Signature: \n');
                console.log(signature);
                console.log('\n');
                rl.question('Press any key to continue', () => {
                    return getUserInput();
                });
                break;
            case '4':
                // Input for verifying symmetric signature
                console.log('Verify Symmetric Signature: \n');
                signature = await rla('Enter the signature: ');
                httpMethod = await rla('Enter the HTTP method: ');
                url = await rla('Enter the URL: ');
                timestamp = await rla('Enter the timestamp: ');
                body = await rla('Enter the body: ');
                accessToken = await rla('Enter the AccessToken: ');

                console.log('Result: ');
                result = verifySymmetricSignature({clientSecret: envVariables.CLIENT_SECRET, signature, httpMethod, relativeUrl: url, timestamp: timestamp, requestBody: JSON.parse(body), accessToken});

                if (result) {
                    // Signature is valid with green color
                    console.log('\x1b[32m', 'Signature is valid');
                    // Reset the color
                    console.log('\x1b[0m');
                } else {
                    console.log('\x1b[31m', 'Signature is invalid')
                    console.log('\x1b[0m');
                }
                console.log('\n');
                rl.question('Press any key to continue', () => {
                    return getUserInput();
                });
                break;
            case 'exit':
                console.log('\nExiting the program. Bye~\n');
                process.exit(0);
                break;
            default:
                console.log('\nInvalid input\n')
                getUserInput();
                break;
        }
    })();
}

function checkEnvVariables() {
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PRIVATE_KEY || !process.env.PJP_PUBLIC_KEY) {
        console.error('Please set the CLIENT_ID, CLIENT_SECRET, PRIVATE_KEY, and PJP_PUBLIC_KEY environment variables');
        process.exit(1);
    }

    envVariables.CLIENT_ID = process.env.CLIENT_ID;
    envVariables.CLIENT_SECRET = process.env.CLIENT_SECRET;
    envVariables.PRIVATE_KEY = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('ascii');
    envVariables.PJP_PUBLIC_KEY = Buffer.from(process.env.PJP_PUBLIC_KEY, 'base64').toString('ascii');
}

getUserInput();