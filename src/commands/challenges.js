const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenges')
        .setDescription('Displays todays Challenges'),
    async execute(interaction) {
        await interaction.reply('Challenges');
    }
}