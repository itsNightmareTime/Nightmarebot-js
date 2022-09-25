import { Client, EmbedBuilder, CommandInteraction, ApplicationCommandOptionType, ChatInputCommandInteraction, User as DiscordUser, APIEmbed, Colors } from "discord.js";
import { getSystemErrorMap } from "util";
import { Command } from '../Command';
import { User } from '../models/user';
import axios from 'axios';
import { format } from "path";

type GameCounter = { [key: string]: number; };

type AchievementInfo = {
    name: string;
    rank: number;
    progress?: number;
    progressMax?: number;
}

type PlayTimes = { [key: string]: number; };

type PlayerStats = {
    achievementScore?: number;
    gamesPlayed?: number;
    gamesWon?: GameCounter;
    gamesLost?: GameCounter;
    timePlayed?: PlayTimes;
    achievements?: AchievementInfo[];
};

// Need to get the current Server IP address as it is not static
const getSwatServerUrl = async(): Promise<string> => {
    try {
        const { data } = await axios(`${process.env.SWAT_SERVER_URL}`, {
            responseType: 'text'
        });
        //Get rid of any newline chars included in response
        return data.replace(/(\r\n|\n|\r)/gm, "");;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unable to get swat server url')
        }
    }
};

const getStatsForUser = async (baseUrl: string, steamId: string): Promise<PlayerStats> => {
    try {
        const { data } = await axios(`${baseUrl}/playerStats/get?steamIds=${steamId}`)
        return data
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Error getting user stats');
        }
    }
};

const generateEmbed = (user: DiscordUser, statsData: PlayerStats): APIEmbed => {

    const getPlayTimes = (playTimes: PlayTimes | undefined): string => {
        if (playTimes) {
            const times: string[] = [];
            for(const time in playTimes) {
                times.push(`${time}: ${playTimes[time]}`)
            }
            return times.join('\n');
        } else {
            return 'No Play Time for User'
        }
    };

    const getWinLoss = (gamesList: GameCounter| undefined): string => {
        if (gamesList) {
            const games: string[] = [];
            for(const game in gamesList) {
                games.push(`${game}: ${gamesList[game]}`)
            }
        } else {
            return 'No Games Reported for User'
        }
    }

    return {
        title: 'Stats',
        color: Colors.DarkerGrey,
        description: `${user.username}#${user.discriminator}`,
        fields: [
            {
                name: 'Play Time',
                inline: true,
                value: getPlayTimes(statsData?.timePlayed)
            },
            {
                name: 'Wins',
                inline: true,
                value: getWinLoss(statsData?.gamesWon)
            },
            {
                name: 'Losses',
                inline: true,
                value: getWinLoss(statsData?.gamesLost)
            }
        ]
    }
}

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
                    try {
                        const steamId = interaction.options.get('steamid')?.value as string;
                        console.log(`User Steam Id is: ${steamId}`)
                        const validId = new RegExp(/^[0-9]{17}$/);

                        if (validId.test(steamId)) {
                            try{
                                User.create({
                                    id: interaction.user.id,
                                    steamId: steamId,
                                    userName: interaction.user.username 
                                });
                                await interaction.reply({ ephemeral: true, content: `Registering User ${interaction.user.username} with SteamId: ${steamId}` })
                            } catch (error) {
                                if (error instanceof Error) {
                                    throw Error;
                                } else {
                                    throw new Error('Unable to add user to database')
                                }
                            }
                        } else {
                            throw new Error('Invalid SteamId 64')
                        }

                    } catch (error) {
                        if (error instanceof Error) {
                            await interaction.reply({ ephemeral: true, content: `Error Registering User: ${error.message}` });
                        } else {
                            await interaction.reply({ ephemeral: true, content: `Error Registering User: Unkown` });
                        }
                    } finally {
                        break;
                    }
                    
                };
                case 'user': {
                    try {
                        const baseUrl = await getSwatServerUrl();
                        const requestedUser = interaction.options.getUser('user');
                        if (requestedUser) {
                            const userData = await User.findByPk(requestedUser.id)
                            const userSteamId = userData?.get('steamId');
                            if (userSteamId) {
                                const statsData = await getStatsForUser(baseUrl, userSteamId);
                                console.log(statsData);
                                await interaction.reply({ ephemeral: true, content: `Getting stats for ${requestedUser.username}` })
                            } else {
                                throw new Error("User not in database or has no registered steamId");
                            }
                        }
                    } catch (error) {
                        if (error instanceof Error) {
                            await interaction.reply({ ephemeral: true, content: `Error Getting stats for User \n ${error.message}`});
                        } else {
                            await interaction.reply({ ephemeral: true, content: `Error Getting stats for User \n Unkown Error` });
                        }
                    } finally {
                        break;
                    }
                };
                case 'me': {
                    try {
                        const baseUrl = await getSwatServerUrl();
                        const userData = await User.findByPk(interaction.user.id)
                        const userSteamId = userData?.get('steamId');
                        if (userSteamId) {
                            const statsData = await getSt-9+86atsForUser(baseUrl, userSteamId);
                            console.log(statsData);
                            await interaction.reply({ ephemeral: true, content: `Getting stats for ${interaction.user.username}` })
                        } else {
                            throw new Error("User not in database or has no registered steamId");
                        }
                    } catch (error) {
                        if (error instanceof Error) {
                            await interaction.reply({ ephemeral: true, content: `Error Getting stats for User: ${interaction.user.username} \n ${error.message}`});
                        } else {
                            await interaction.reply({ ephemeral: true, content: `Error Getting stats for User: ${interaction.user.username} \n Unkown Error` });
                        }
                    } finally {
                        break;
                    }
                }
                default: {
                    await interaction.reply({ ephemeral: true, content: `Unknown subCommand of stats called` })
                }
            }
        }
    },
};
