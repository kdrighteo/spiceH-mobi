const { Client, Account } = require('appwrite');

const client = new Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('683daec3001f4fb08be2');

const account = new Account(client);

async function testLogin() {
  try {
    // Replace with the email and password you set in the Appwrite dashboard
    const email = 'kdrighteo@gmail.com';
    const password = '12345678';
    const session = await account.createSession(email, password);
    console.log('Login success:', session);
  } catch (error) {
    console.error('Login error:', error);
  }
}

testLogin(); 