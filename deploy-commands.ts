const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

dotenv.config();

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with Server Info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with User Info!'),
]

commands.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands!'))
    .catch(console.error);