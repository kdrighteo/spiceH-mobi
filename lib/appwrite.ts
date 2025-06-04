import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // TODO: Replace with your Appwrite endpoint
  .setProject('683daec3001f4fb08be2'); // Correct Appwrite project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage }; 