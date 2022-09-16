import fs from 'node:fs';
import path from 'node:path';
import { Client, ClientOptions, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';
dotenv.config();


console.log("Bot is starting...")

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

ready(client);
interactionCreate(client);

//Login
client.login(process.env.BOT_TOKEN);