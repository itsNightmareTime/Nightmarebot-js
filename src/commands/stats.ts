import { Client, EmbedBuilder, CommandInteraction, ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteractionOption } from "discord.js";
import { getSystemErrorMap } from "util";
import { Command } from '../Command';
import { User } from '../models/user';

export const Stats: Command = {
    name: 'stats',
    description: 'Gets stats about a Swat: Reborn player',
    options: [
        {
            name: 'register',
            description: 'Registers the user for the stats command',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'steamid',
                    description: 'The SteamID of the user registering. Must be your 17 digit steamId64',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'user',
            description: 'Shows the stats of the provided user',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want stats for',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'me',
            description: 'Gets the stats for the user that called the command',
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {

        if (interaction instanceof ChatInputCommandInteraction) {
            //Figure out which sub command is being used
            const subCommand = interaction.options.getSubcommand();

            switch (subCommand) {
                case 'register': {
                    console.log(`Registering User: ${interaction.user.username}`)
                    try {
                        const steamId = interaction.options.get('steamid')?.value as string;
                        console.log(`User Steam Id is: ${steamId}`)
                        const validId = new RegExp(/^[0-9]{17}$/);

                        if (validId.test(steamId)) {
                            await interaction.reply({ ephemeral: true, content: `Registering User ${interaction.user.username} with SteamId: ${steamId}` })
                        } else {
                            throw new Error('Invalid SteamId 64')
                        }

                    } catch (error) {
                        if (error instanceof Error) {
                            await interaction.reply({ ephemeral: true, content: `Error Registering User: ${error.message}` });
                        } else {
                            await interaction.reply({ ephemeral: true, content: `Error Registering User: Unkown` });
                        }
                    }
                    break;
                };
                case 'user': {
                    const userOption = interaction.options.get('user') as CommandInteractionOption;
                    const requestedUser = userOption.user;

                    await interaction.reply({ ephemeral: true, content: `Getting stats for ${requestedUser?.username}` })
                    break;
                };
                case 'me': {
                    await interaction.reply({ ephemeral: true, content: `Getting stats for ${interaction.user.username}` })
                    break;
                }
                default: {
                    await interaction.reply({ ephemeral: true, content: `Unknown subCommand of stats called` })
                }
            }
        }
    },
};
