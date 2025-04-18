import {
  Client,
  CommandInteraction,
  ChatInputCommandInteraction,
  User as DiscordUser,
  APIEmbed,
  Colors,
  ApplicationCommandOptionType,
} from "discord.js";
import { Duration } from "luxon";
import { Command } from "../Command";
import User from "../models/user";
import { PlayerStats } from "../interfaces/rcpdinterfaces";
import RCPDService from "../services/rcpd";

const rcpdservice = new RCPDService();

type PlayTimes = { [key: string]: number }
type GameCounter = { [key: string]: number }

const generateEmbed = (user: DiscordUser, statsData: PlayerStats): APIEmbed => {
  const getPlayTimes = (playTimes: PlayTimes | undefined): string => {
    if (playTimes) {
      const times: string[] = [];
      for (const time in playTimes) {
        const timeDuration = Duration.fromObject({
          seconds: playTimes[time],
        }).shiftTo("days", "hours", "minutes", "seconds");
        const formatedDuration = timeDuration.toHuman({
          signDisplay: "never",
          unitDisplay: "short",
          listStyle: "narrow",
        });
        times.push(`${time}: ${formatedDuration}`);
      }
      return times.join("\n");
    } else {
      return "No Play Time for User";
    }
  };

  const getWinLoss = (gamesList: GameCounter | undefined): string => {
    if (gamesList?.pin) {
        gamesList.insane += gamesList.pin;
        delete gamesList.pin
    };

    if (gamesList) {
      const games: string[] = [];
      for (const game in gamesList) {
        games.push(`${game}: ${gamesList[game]}`);
      }
      return games.join("\n");
    } else {
      return "No Games Reported for User";
    }
  };

  return {
    title: "Stats",
    color: Colors.DarkerGrey,
    description: `${user.username}#${user.discriminator}`,
    fields: [
      {
        name: "Play Time",
        inline: true,
        value: getPlayTimes(statsData.timePlayed),
      },
      {
        name: "Wins",
        inline: true,
        value: getWinLoss(statsData.gamesWon),
      },
      {
        name: "Losses",
        inline: true,
        value: getWinLoss(statsData.gamesLost),
      },
    ],
  };
};

export const Stats: Command = {
  name: "stats",
  description: "Gets stats about a Swat: Reborn player",
  options: [
    {
      name: "register",
      description: "Registers the user for the stats command",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "steamid",
          description:
            "The SteamID of the user registering. Must be your 17 digit steamId64",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "user",
      description: "Shows the stats of the provided user",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user you want stats for",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "me",
      description: "Gets the stats for the user that called the command",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (interaction instanceof ChatInputCommandInteraction) {
      //Figure out which sub command is being used
      const subCommand = interaction.options.getSubcommand();
      switch (subCommand) {
        case "register": {
          try {
            const steamId = interaction.options.get("steamid")?.value as string;
            const validId = new RegExp(/^[0-9]{17}$/);
            const user = await User.findOne({discordId: interaction.user.id})
            if (user) {
              //Update User Instead
              if (validId.test(steamId)) {
                try {
                  await User.findOneAndUpdate({
                    discordId: interaction.user.id,
                  },
                  {
                    steamId
                  });
                  await interaction.reply({
                    ephemeral: true,
                    content: `Updating existing User: ${interaction.user.username} with SteamId: ${steamId}`,
                  });
                  return;
                } catch (error) {
                  if (error instanceof Error) {
                    throw Error;
                  } else {
                    throw new Error("Unable to add user to database");
                  }
                }
              } else {
                throw new Error(
                  "Unable to update existing User: Invalid SteamId 64"
                );
              }
            } else {
              if (validId.test(steamId)) {
                try {
                  User.create({
                    discordId: interaction.user.id,
                    steamId: steamId,
                    userName: interaction.user.username,
                  });
                  await interaction.reply({
                    ephemeral: true,
                    content: `Registering User ${interaction.user.username} with SteamId: ${steamId}`,
                  });
                } catch (error) {
                  if (error instanceof Error) {
                    throw Error;
                  } else {
                    throw new Error("Unable to add user to database");
                  }
                }
              } else {
                throw new Error("Unable to register new User: Invalid SteamId 64");
              }
            }
          } catch (error) {
            if (error instanceof Error) {
              await interaction.reply({
                ephemeral: true,
                content: `Error Registering User: ${error.message}`,
              });
            } else {
              await interaction.reply({
                ephemeral: true,
                content: `Error Registering User: Unkown`,
              });
            }
            
          }
          break;
        }
        case "user": {
          try {
            const requestedUser = interaction.options.getUser("user");
            if (requestedUser) {
              const userData = await User.findOne({ discordId: interaction.user.id});
              if (userData) {
                const statsData = await rcpdservice.getPlayerStats([userData.steamId]);
                await interaction.reply({
                  ephemeral: true,
                  embeds: [generateEmbed(requestedUser, statsData[0])]
                });
              } else {
                throw new Error(
                  "User not in database or has no registered steamId"
                );
              }
            }
          } catch (error) {
            if (error instanceof Error) {
              await interaction.reply({
                ephemeral: true,
                content: `Error Getting stats for User \n ${error.message}`,
              });
            } else {
              await interaction.reply({
                ephemeral: true,
                content: `Error Getting stats for User \n Unkown Error`,
              });
            }
          }
          break;
        }
        case "me": {
          try {
            const userData = await User.findOne({discordId: interaction.user.id})
            const userSteamId = userData?.get("steamId");
            if (userSteamId) {
              const statsData = await rcpdservice.getPlayerStats([userSteamId]);
              await interaction.reply({
                ephemeral: true,
                embeds: [generateEmbed(interaction.user, statsData[0])],
              });
            } else {
              throw new Error(
                "User not in database or has no registered steamId"
              );
            }
          } catch (error) {
            if (error instanceof Error) {
              await interaction.reply({
                ephemeral: true,
                content: `Error Getting stats for User: ${interaction.user.username} \n ${error.message}`,
              });
            } else {
              await interaction.reply({
                ephemeral: true,
                content: `Error Getting stats for User: ${interaction.user.username} \n Unkown Error`,
              });
            }
          }
          break;
        }
        default: {
          await interaction.reply({
            ephemeral: true,
            content: `Unknown subCommand of stats called`,
          });
        }
      }
    }
  },
};
