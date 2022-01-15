import { Client, ClientOptions, Intents } from 'discord.js'
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import interactionCreate from "./listeners/interactionCreate";
import ready from './listeners/ready';

console.log("Logging in...");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

ready(client);
interactionCreate(client);

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);