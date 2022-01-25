import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from '../command';

export const ping: Command = {
    name: "ping",
    description: "Returns PONG!",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "PONG!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};