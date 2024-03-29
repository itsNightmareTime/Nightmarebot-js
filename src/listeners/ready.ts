import { Client } from 'discord.js';
import { Commands } from "../Commands";
import { database } from '../connection/connection';

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands);
        await database.sync();
        console.log(`${client.user.username} is Online`);
    })
}
