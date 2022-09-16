import { CommandInteraction ,Client, Interaction } from 'discord.js';
import { Command } from '../Command';
import { Commands } from '../Commands';

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find((c: Command) => c.name === interaction.commandName);

    if (!slashCommand) {
        interaction.followUp({ content: "Command not in list of commands" })
        return;
    }

    slashCommand.run(client, interaction);
}